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
	case "create game":
		createGame(msgReq, c)
		err := c.conn.WriteJSON(models.MessageResponse{
			Type: "take room id",
			Data: *c.room.game,
		})
		if err != nil {
			log.Println(err)
		}
		// c.room.broadcast <- jsonData
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
	default:
		log.Println("unkown msgReq type: ", msgReq.Type)
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

func createGame(msgReq models.MessageRequest, c *Client) {
	var createGame CreateGameData
	if err := json.Unmarshal(msgReq.Data, &createGame); err != nil {
		log.Println("Ошибка при парсинге JSON: ", err)
		return
	}

	if ConnectToRoom(c) {
		return
	}

	CreateNewRoom(c)
}

func ConnectToRoom(c *Client) bool {
	for _, r := range c.hub.rooms {
		if len(r.clients) < 2 && r.id != "default" {
			c.room = r

			//sendCreateGameResponse(c)

			log.Println("connect room roomID: ", r.id)
			return true
		}
	}
	return false
}

func CreateNewRoom(c *Client) {
	id := uuid.New().String()
	roomPtr := newRoom(id, tools.CreateNewGameTable(id))

	if roomPtr.game.Player1.Name == "name" {
		roomPtr.game.Player1.Name = c.id
	} else {
		roomPtr.game.Player2.Name = c.id
	}

	c.room = roomPtr
	c.hub.rooms[roomPtr.id] = roomPtr

	//sendCreateGameResponse(c)

	log.Println("create room roomID: ", roomPtr.game.Id)
}

func sendCreateGameResponse(c *Client) {
	c.conn.WriteJSON(struct {
		Type string
		Data Data
	}{
		Type: "take room id",
		Data: Data{
			RoomID: c.room.id,
			Game:   *c.room.game,
		},
	})
}