package services

import (
	"encoding/json"
	"log"

	"github.com/rrenatars/hearthstone-ispring/internal/models"
)

func SetupMessageTypes(message models.MessageRequest, gameTable *models.GameTable) *models.MessageResponse {
	var msgResponse *models.MessageResponse
	switch message.Type {
	case "start game":
		msgResponse = startGame(message.Data, gameTable)
	case "exchange cards":
		var data models.ExchangeCardsDataType
		err := json.Unmarshal(message.Data, &data)
		log.Println()
		if err != nil {
			log.Println("Error parsing exchange cards data:", err.Error())
			return models.NewMessageResponse(err.Error(), *gameTable)
		}

		msgResponse = exchangeCardsRun(gameTable, data)
	case "end turn":
		msgResponse = endTurn(gameTable)
	case "card drag":
		var data models.CardDragDataType
		err := json.Unmarshal(message.Data, &data)
		if err != nil {
			log.Println("Error parsing card drag data:", err.Error())
			return models.NewMessageResponse(err.Error(), *gameTable)
		}
		log.Println(data.CardInHandId, " ", data.Player)

		msgResponse = cardDrag(&data, gameTable)
	case "end game":
		msgResponse = endGame(message, gameTable)
	default:
		log.Panicln("i don't know this type of message: ", message.Type)
		return models.NewMessageResponse("i don't know this type of message: ", *gameTable)
	}
	return msgResponse
}
