package models

type GameTable struct {
	Player1 *Player
	Player2 *Player
	History []CardData
}

func NewGameTable(pl1, pl2 *Player, history []CardData) *GameTable {
	return &GameTable{
		Player1: pl1,
		Player2: pl2,
		History: history,
	}
}

func (g *GameTable) UpdateGameTable(_g *GameTable) {
	*g = *_g
}
