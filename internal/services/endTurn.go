package services

import "github.com/rrenatars/hearthstone-ispring/internal/models"

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
