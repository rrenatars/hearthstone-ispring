package services

import (
	"github.com/rrenatars/hearthstone-ispring/internal/models"
)

func exchangeCardsRun(g *models.GameTable, exCardIds models.ExchangeCardsDataType) *models.MessageResponse {
	cards := exchangeCards(g, exCardIds)

	g.UpdateGameTable(
		models.NewGameTable(
			models.NewPlayer(
				g.Player1.Name,
				cards,
				g.Player1.Deck,
				g.Player1.Cards,
				g.Player1.Turn,
				g.Player1.HP,
				g.Player1.Def,
			),
			g.Player2,
			g.History,
		),
	)

	return models.NewMessageResponse("exchange cards", *g)
}

func exchangeCards(g *models.GameTable, exCardIds models.ExchangeCardsDataType) []models.CardData {

	if len(exCardIds.ReplacedCardIds) <= 0 {
		return g.Player1.Hand
	}

	newCards := GetRandomElementsFromDeck(g.Player1.Deck, len(exCardIds.ReplacedCardIds))

	for _, c := range g.Player1.Hand {
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
