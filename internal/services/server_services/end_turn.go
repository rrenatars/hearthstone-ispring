package serverservices

import (
	"github.com/rrenatars/hearthstone-ispring/internal/models"
	"github.com/rrenatars/hearthstone-ispring/internal/tools"
)

func SetUpEndTurn(gameTable *models.GameTable) {

	if gameTable.Player1.Turn {
		endTurn(gameTable.Player1, gameTable.Player2, gameTable.History)
	}

	if gameTable.Player2.Turn {
		endTurn(gameTable.Player2, gameTable.Player1, gameTable.History)
	}

	gameTable.Player1.Turn = !gameTable.Player1.Turn
	gameTable.Player2.Turn = !gameTable.Player2.Turn

	return
}

func setMana(p *models.Player) {
	p.CounterOfMoves++
	p.Mana = p.CounterOfMoves
	if p.Mana >= 10 {
		p.Mana = 10
	}
}

func endTurn(p *models.Player, o *models.Player, history []models.CardData) {
	setMana(p)

	o.HeroTurn = false

	if len(o.Hand) == 5 {
		return
	}

	if len(o.Deck) == 0 {
		o.HP -= 2
		o.Hand = append(o.Hand, tools.GetRandomElementsFromDeck(&history, 1)...)
		return
	}

	o.Hand = append(o.Hand, o.Deck[0])
	o.Deck = o.Deck[1:]
}

func EndTurn(gameTable *models.GameTable) {
	if gameTable.Player1.Turn {
		gameTable.Player1.CounterOfMoves++
		gameTable.Player1.Mana = gameTable.Player1.CounterOfMoves
		if gameTable.Player1.Mana >= 10 {
			gameTable.Player1.Mana = 10
		}
	} else {
		gameTable.Player2.CounterOfMoves++
		gameTable.Player2.Mana = gameTable.Player2.CounterOfMoves
		if gameTable.Player2.Mana >= 10 {
			gameTable.Player2.Mana = 10
		}
	}
	gameTable.Player1.Turn = !gameTable.Player1.Turn
	gameTable.Player2.Turn = !gameTable.Player2.Turn
	if gameTable.Player1.Turn {
		if len(gameTable.Player2.Hand) == 5 {
			return
		}
		if len(gameTable.Player2.Deck) == 0 {
			gameTable.Player2.HP -= 2
			return
		}
		gameTable.Player2.Hand = append(gameTable.Player2.Hand, gameTable.Player2.Deck[0])
		gameTable.Player2.Deck = gameTable.Player2.Deck[1:]
		return
	}
	if len(gameTable.Player1.Hand) == 5 {
		return
	}
	if len(gameTable.Player1.Deck) == 0 {
		gameTable.Player2.HP -= 2
		return
	}
	gameTable.Player1.Hand = append(gameTable.Player1.Hand, gameTable.Player1.Deck[0])
	gameTable.Player1.Deck = gameTable.Player1.Deck[1:]
	return
}
