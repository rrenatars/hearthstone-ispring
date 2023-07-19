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

func startGame(data any, gameTable *models.GameTable) *models.MessageResponse {
	return &models.MessageResponse{}
}

func endTurn(gameTable *models.GameTable) *models.MessageResponse {
	if gameTable.Player1.Turn {
		if len(gameTable.Player2.Hand) == 5 {
			gameTable.UpdateGameTable(
				models.NewGameTable(
					models.NewPlayer(
						gameTable.Player1.Name,
						gameTable.Player1.Hand,
						gameTable.Player1.Deck,
						gameTable.Player1.Cards,
						!gameTable.Player1.Turn,
						gameTable.Player1.HP,
						gameTable.Player1.Def,
					),
					models.NewPlayer(
						gameTable.Player2.Name,
						gameTable.Player2.Hand,
						gameTable.Player2.Deck,
						gameTable.Player2.Cards,
						!gameTable.Player2.Turn,
						gameTable.Player2.HP,
						gameTable.Player2.Def,
					),
					gameTable.History,
				))
			return models.NewMessageResponse(
				"turn",
				*gameTable,
			)
		}
		if len(gameTable.Player2.Deck) == 0 {
			gameTable.UpdateGameTable(
				models.NewGameTable(
					models.NewPlayer(
						gameTable.Player1.Name,
						gameTable.Player1.Hand,
						gameTable.Player1.Deck,
						gameTable.Player1.Cards,
						!gameTable.Player1.Turn,
						gameTable.Player1.HP,
						gameTable.Player1.Def,
					),
					models.NewPlayer(
						gameTable.Player2.Name,
						gameTable.Player2.Hand,
						gameTable.Player2.Deck,
						gameTable.Player2.Cards,
						!gameTable.Player2.Turn,
						gameTable.Player2.HP, //сделать минус хп
						gameTable.Player2.Def,
					),
					gameTable.History,
				))
			return models.NewMessageResponse(
				"turn",
				*gameTable,
			)
		}
		gameTable.UpdateGameTable(models.NewGameTable(
			models.NewPlayer(
				gameTable.Player1.Name,
				gameTable.Player1.Hand,
				gameTable.Player1.Deck,
				gameTable.Player1.Cards,
				!gameTable.Player1.Turn,
				gameTable.Player1.HP,
				gameTable.Player1.Def,
			),
			models.NewPlayer(
				gameTable.Player2.Name,
				append(gameTable.Player2.Hand, gameTable.Player2.Deck[0]),
				gameTable.Player2.Deck[1:],
				gameTable.Player2.Cards,
				!gameTable.Player2.Turn,
				gameTable.Player2.HP,
				gameTable.Player2.Def,
			),
			gameTable.History,
		))
		return models.NewMessageResponse(
			"turn",
			*gameTable,
		)
	}
	if len(gameTable.Player1.Hand) == 5 {
		gameTable.UpdateGameTable(models.NewGameTable(
			models.NewPlayer(
				gameTable.Player1.Name,
				gameTable.Player1.Hand,
				gameTable.Player1.Deck,
				gameTable.Player1.Cards,
				!gameTable.Player1.Turn,
				gameTable.Player1.HP,
				gameTable.Player1.Def,
			),
			models.NewPlayer(
				gameTable.Player2.Name,
				gameTable.Player2.Hand,
				gameTable.Player2.Deck,
				gameTable.Player2.Cards,
				!gameTable.Player2.Turn,
				gameTable.Player2.HP,
				gameTable.Player2.Def,
			),
			gameTable.History,
		))
		return models.NewMessageResponse(
			"turn",
			*gameTable,
		)
	}
	if len(gameTable.Player1.Deck) == 0 {
		gameTable.UpdateGameTable(
			models.NewGameTable(
				models.NewPlayer(
					gameTable.Player1.Name,
					gameTable.Player1.Hand,
					gameTable.Player1.Deck,
					gameTable.Player1.Cards,
					!gameTable.Player1.Turn,
					gameTable.Player1.HP,
					gameTable.Player1.Def,
				),
				models.NewPlayer(
					gameTable.Player2.Name,
					gameTable.Player2.Hand,
					gameTable.Player2.Deck,
					gameTable.Player2.Cards,
					!gameTable.Player2.Turn,
					gameTable.Player2.HP, //сделать минус хп
					gameTable.Player2.Def,
				),
				gameTable.History,
			))
		return models.NewMessageResponse(
			"turn",
			*gameTable,
		)
	}
	gameTable.UpdateGameTable(
		models.NewGameTable(
			models.NewPlayer(
				gameTable.Player1.Name,
				append(gameTable.Player1.Hand, gameTable.Player1.Deck[0]),
				gameTable.Player1.Deck[1:],
				gameTable.Player1.Cards,
				!gameTable.Player1.Turn,
				gameTable.Player1.HP,
				gameTable.Player1.Def,
			),
			models.NewPlayer(
				gameTable.Player2.Name,
				gameTable.Player2.Hand,
				gameTable.Player2.Deck,
				gameTable.Player2.Cards,
				!gameTable.Player2.Turn,
				gameTable.Player2.HP,
				gameTable.Player2.Def,
			),
			gameTable.History,
		))
	return models.NewMessageResponse(
		"turn",
		*gameTable,
	)
}

func cardDrag(message *models.CardDragDataType, gameTable *models.GameTable) *models.MessageResponse {
	if message.Player {
		// Ход первого игрока
		newPlayer1, err := playerMadeMove(message.CardInHandId, gameTable.Player1)
		if err != nil {
			log.Println(err.Error(), message.CardInHandId, gameTable.Player1.Hand)
			return models.NewMessageResponse(
				err.Error(),
				*gameTable,
			)
		}
		gameTable.UpdateGameTable(
			models.NewGameTable(
				newPlayer1,
				gameTable.Player2,
				gameTable.History,
			))
		return models.NewMessageResponse(
			"card drag",
			*gameTable,
		)
	}
	// Ход второго игрока
	newPlayer2, err := playerMadeMove(message.CardInHandId, gameTable.Player2)
	if err != nil {
		log.Println(err.Error())
		return models.NewMessageResponse(
			err.Error(),
			*gameTable,
		)
	}
	gameTable.UpdateGameTable(
		models.NewGameTable(
			gameTable.Player1,
			newPlayer2,
			gameTable.History,
		))
	return models.NewMessageResponse(
		"card drag",
		*gameTable,
	)
}

func endGame(message models.MessageRequest, gameTable *models.GameTable) *models.MessageResponse {
	return &models.MessageResponse{}
}
