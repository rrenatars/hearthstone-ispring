package server

import (
	"encoding/json"
	"log"

	"github.com/google/uuid"
	"github.com/rrenatars/hearthstone-ispring/internal/models"
	serverservices "github.com/rrenatars/hearthstone-ispring/internal/services/server_services"
	"github.com/rrenatars/hearthstone-ispring/internal/tools"
)

func setupMessageTypes(msgReq models.MessageRequest, c *Client) {
	log.Println(msgReq.Type)
	switch msgReq.Type {
	case "create bot game":
		createGame(msgReq, c, bot)
		err := c.conn.WriteJSON(models.MessageResponse{
			Type: "take room id",
			Data: *c.room.game,
		})
		if err != nil {
			log.Println(err)
		}
	case "create game":
		createGame(msgReq, c, multiplayer)
		err := c.conn.WriteJSON(models.MessageResponse{
			Type: "take room id",
			Data: *c.room.game,
		})
		if err != nil {
			log.Println(err)
		}
	case "give me a game":
		giveMeGame(c)
	case "exchange cards":
		exchangeCards(msgReq, c)
		jsonData, err := json.Marshal(models.MessageResponse{
			Type: "exchange cards",
			Data: *c.room.game,
		})
		if err != nil {
			log.Println(err)
		}
		c.room.broadcast <- jsonData
	case "end turn":
		serverservices.EndTurn(c.room.game)
		if c.room.bot {
			serverservices.Bot(c.room.game)
			serverservices.EndTurn(c.room.game)
		}
		jsonData, err := json.Marshal(models.MessageResponse{
			Type: "turn",
			Data: *c.room.game,
		})
		if err != nil {
			log.Println(err)
		}
		c.room.broadcast <- jsonData
	case "card drag":
		log.Println("hello card drag")
		cardDrag(&msgReq, c)
		jsonData, err := json.Marshal(models.MessageResponse{
			Type: "card drag",
			Data: *c.room.game,
		})
		if err != nil {
			log.Println(err)
		}
		c.room.broadcast <- jsonData
	case "attack":
		attack(&msgReq, c)
		jsonData, err := json.Marshal(models.MessageResponse{
			Type: "attack",
			Data: *c.room.game,
		})
		if err != nil {
			log.Println(err)
		}
		c.room.broadcast <- jsonData
	default:
		log.Println("unkown msgReq type: ", msgReq.Type)
	}
}

func attack(msgReq *models.MessageRequest, c *Client) {
	attackData, err := serverservices.ParseToAttackType(msgReq)
	if err != nil {
		log.Println(err)
	}
	log.Println(attackData)

	err = serverservices.Attack(attackData, c.room.game)
	if err != nil {
		log.Println(err)
	}
}

func cardDrag(msgReq *models.MessageRequest, c *Client) {
	data, err := serverservices.ParseToCardDragDataType(msgReq)
	if err != nil {
		return
	}
	serverservices.CardDrag(c.id, &data, c.room.game)
}

func exchangeCards(msgReq models.MessageRequest, c *Client) {
	data, err := serverservices.ParseToExchangeCardsDataType(msgReq)
	if err != nil {
		return
	}
	serverservices.ExchangeCardsDataType(c.room.game, c.id, data)
}

func giveMeGame(c *Client) {
	log.Println("take a game")

	c.conn.WriteJSON(models.MessageResponse{
		Type: "take a game",
		Data: *c.room.game,
	})
}

func createGame(msgReq models.MessageRequest, c *Client, b bool) {
	var createGame CreateGameData
	if err := json.Unmarshal(msgReq.Data, &createGame); err != nil {
		log.Println("Ошибка при парсинге JSON: ", err)
		return
	}

	if !b && ConnectToRoom(c) {
		return
	}

	CreateNewRoom(c, b)
}

func ConnectToRoom(c *Client) bool {
	for _, r := range c.hub.rooms {
		if len(r.clients) < 2 && r.id != "default" && !r.bot {
			c.room = r
			if c.room.game.Player2.Name == "name" {
				c.room.game.Player2.Name = c.id
			} else if c.room.game.Player1.Name == "name" {
				c.room.game.Player1.Name = c.id
			} else {
				log.Println("error log conncection")
			}

			log.Println("connect room roomID: ", r.id)
			return true
		}
	}
	return false
}

func CreateNewRoom(c *Client, b bool) {
	g, err := tools.CreateNewGameTable(uuid.New().String(), b)
	if err != nil {
		log.Println(err)
		return
	}

	roomPtr := newRoom(g.Id, g, b)

	if roomPtr.game.Player1.Name == "name" {
		roomPtr.game.Player1.Name = c.id
	} else {
		roomPtr.game.Player2.Name = c.id
	}

	c.room = roomPtr
	c.hub.rooms[roomPtr.id] = roomPtr

	log.Println("create room roomID: ", roomPtr.game.Id)
}
