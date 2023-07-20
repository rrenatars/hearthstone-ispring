package services

import (
	"errors"
	"log"
	"strings"

	"github.com/rrenatars/hearthstone-ispring/internal/models"
)

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

func removeElemsFromSlice(cards []models.CardData, index int) []models.CardData {
	if index < 0 || index >= len(cards) {
		return cards
	}

	return append(cards[:index], cards[index+1:]...)
}

func playerMadeMove(id string, pl *models.Player) (*models.Player, error) {
	if len(pl.Hand) == 0 {
		return pl, errors.New("player1 hand is empty")
	}
	index, err := getIndexByCardID(id, pl.Hand)
	if err != nil {
		return pl, err
	}
	newCard := pl.Hand[index]
	newCard.Portrait = strings.Replace(pl.Hand[index].Portrait, "cards-in-hand", "creatures", 1)
	newCards := append(pl.Cards, newCard)
	newHand := removeElemsFromSlice(pl.Hand, index)
	return models.NewPlayer(
		pl.Name,
		newHand,
		pl.Deck,
		newCards,
		pl.Turn,
		pl.HP,
		pl.Def,
	), nil
}

func getIndexByCardID(id string, cards []models.CardData) (int, error) {
	for index, value := range cards {
		if value.CardID == id {
			return index, nil
		}
	}
	return -1, errors.New("a card with that ID does not exist")
}
