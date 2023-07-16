package models

type Player struct {
	Name  string
	Hand  []CardData
	Cards []CardData
	Deck  []CardData
	Turn  bool
	HP    int
	Def   int
}

type GameTable struct {
	Player1 *Player
	Player2 *Player
	History []CardData
}

type CardData struct {
	Name          string `db:"name"`
	Portrait      string `db:"portrait"`
	CardID        string `db:"card_id"`
	Specification string `db:"specification"`
	Mana          int    `db:"mana"`
	Attack        int    `db:"attack"`
	Defense       int    `db:"defense"`
}
