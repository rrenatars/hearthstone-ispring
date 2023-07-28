package serverservices

import "github.com/rrenatars/hearthstone-ispring/internal/models"

func EndTurn(gameTable *models.GameTable) {
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
