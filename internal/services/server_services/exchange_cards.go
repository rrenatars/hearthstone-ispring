package serverservices

import (
	"encoding/json"
	"errors"
	"log"

	"github.com/rrenatars/hearthstone-ispring/internal/models"
	"github.com/rrenatars/hearthstone-ispring/internal/tools"
)

func ParseToExchangeCardsDataType(msgReq models.MessageRequest) (models.ExchangeCardsDataType, error) {
	var data models.ExchangeCardsDataType
	err := json.Unmarshal(msgReq.Data, &data)
	if err != nil {
		log.Println("Error parsing exchange cards data:", err.Error())
		return models.ExchangeCardsDataType{}, err
	}
	return data, nil
}

func ExchangeCardsDataType(game *models.GameTable, idPlayer string, exCardIds models.ExchangeCardsDataType) error {
	if idPlayer == game.Player1.Name {
		game.Player1.Hand = exchangeCards(game.Player1.Hand, game.Player1.Deck, exCardIds)
		log.Println("карты после exchange", game.Player1.Hand)
		game.Player1.CounterOfMoves++
		log.Println("mana", game.Player1.CounterOfMoves)
		game.Player1.Mana = game.Player1.CounterOfMoves
		log.Println("player 1, id: ", idPlayer)
		return nil
	}

	if idPlayer == game.Player2.Name {
		game.Player2.Hand = exchangeCards(game.Player2.Hand, game.Player2.Deck, exCardIds)
		log.Println("карты после exchange", game.Player2.Hand)
		game.Player2.CounterOfMoves++
		log.Println("mana", game.Player2.CounterOfMoves)
		game.Player2.Mana = game.Player2.CounterOfMoves
		log.Println("player 2, id: ", idPlayer)
		return nil
	}

	return errors.New("idPlayer != player1 name or player2 name")
}

func exchangeCards(cards []models.CardData, deck []models.CardData, exCardIds models.ExchangeCardsDataType) []models.CardData {
	if len(exCardIds.ReplacedCardIds) <= 0 {
		log.Println("len excardsids <= 0")
		return cards
	}

	newCards := tools.GetRandomElementsFromDeck(&deck, len(exCardIds.ReplacedCardIds))

	for _, c := range cards {
		f := false
		for _, cardID := range exCardIds.ReplacedCardIds {
			if c.CardID == cardID {
				f = true
			}
		}
		if !f {
			newCards = append(newCards, c)
		}
	}

	return newCards
}
