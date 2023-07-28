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
