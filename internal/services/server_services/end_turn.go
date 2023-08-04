package serverservices

import (
	"github.com/rrenatars/hearthstone-ispring/internal/models"
	"log"
)

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
	log.Println("end turn Player1", gameTable.Player1)
	log.Println("end turn Player2", gameTable.Player2)
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
