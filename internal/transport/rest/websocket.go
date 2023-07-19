package rest

import (
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"github.com/rrenatars/hearthstone-ispring/internal/models"
	"github.com/rrenatars/hearthstone-ispring/internal/services"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin:     func(r *http.Request) bool { return true },
}

func wsEndpoint(c *gin.Context) {
	gameTable := c.MustGet("gameTable").(*models.GameTable)
	ws, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		log.Println("upgrader er:", err.Error())
		return
	}

	log.Println("Client Connected")

	message := *models.NewMessageResponse("start game", *gameTable)
	if err = ws.WriteJSON(message); err != nil {
		log.Println("gametable send err:", err.Error())
		return
	}

	reader(ws, gameTable)
}

func reader(conn *websocket.Conn, gameTable *models.GameTable) {
	for {
		messageType, p, err := conn.ReadMessage()
		if err != nil {
			log.Println(err.Error())
			return
		}

		log.Println(string(p), " ", messageType)

		msgResponse, err := ParseMessage(messageType, p, gameTable, conn)
		if err != nil {
			if err := conn.WriteJSON(msgResponse); err != nil {
				log.Println("msg send err:", err.Error())
			}
			return
		}
		services.BotVeryStupid(conn, &msgResponse.Data)
		gameTable.UpdateGameTable(&msgResponse.Data)
		if err := conn.WriteJSON(msgResponse); err != nil {
			log.Println("msg send err:", err.Error())
		}
	}
}

func ParseMessage(messageType int, p []byte, gameTable *models.GameTable, conn *websocket.Conn) (*models.MessageResponse, error) {
	if messageType == 1 {
		var message models.MessageRequest
		if err := json.Unmarshal(p, &message); err != nil {
			log.Println("error while parsing JSON data: ", err.Error())
			return models.NewMessageResponse(err.Error(), *gameTable),
				errors.New(fmt.Sprintln("error while parsing JSON data: ", err.Error()))
		}
		return services.SetupMessageTypes(message, gameTable), nil
	}

	log.Println("unkown messageType: ", messageType)
	return models.NewMessageResponse(fmt.Sprintln("unkown messageType: ", messageType), *gameTable),
		errors.New(fmt.Sprintln("unkown messageType: ", messageType))
}
