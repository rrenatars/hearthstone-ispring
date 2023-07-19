package services

import (
	"log"

	"github.com/gorilla/websocket"
	"github.com/rrenatars/hearthstone-ispring/internal/models"
)

func BotVeryStupid(conn *websocket.Conn, g *models.GameTable) {
	if g.Player2.Turn {
		if len(g.Player2.Hand) == 0 {
			log.Println("bot hand clear")
			return
		}

		newPlayer1 := g.Player1
		newPlayer1.Turn = !newPlayer1.Turn
		if newPlayer1.Turn && len(newPlayer1.Deck) > 0 {
			newPlayer1.Hand = append(newPlayer1.Hand, newPlayer1.Deck[0])
			newPlayer1.Deck = newPlayer1.Deck[1:]
		}

		newPlayer2, err := playerMadeMove(g.Player2.Hand[0].CardID, g.Player2)
		if err != nil {
			log.Println(err)
			return
		}
		newPlayer2.Turn = !newPlayer2.Turn

		g.UpdateGameTable(
			models.NewGameTable(
				newPlayer1,
				newPlayer2,
				g.History,
			),
		)
	}
}
