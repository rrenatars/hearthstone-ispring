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

func NewPlayer(name string, hand, deck, cards []CardData, turn bool, hp, def int) *Player {
	return &Player{
		Name:  name,
		Hand:  hand,
		Deck:  deck,
		Cards: cards,
		Turn:  turn,
		HP:    hp,
		Def:   def,
	}
}

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

type CardData struct {
	Name          string `db:"name"`
	Portrait      string `db:"portrait"`
	CardID        string `db:"card_id"`
	Specification string `db:"specification"`
	HP            int    `db:"healthpoint"`
	Mana          int    `db:"mana"`
	Attack        int    `db:"attack"`
	Defense       int    `db:"defense"`
}

func NewCard(name, portrait, cardId, specification string, hp, mana, attack, def int) *CardData {
	return &CardData{
		Name:          name,
		Portrait:      portrait,
		CardID:        cardId,
		Specification: specification,
		HP:            hp,
		Mana:          mana,
		Attack:        attack,
		Defense:       def,
	}
}
