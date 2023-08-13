package models

type Player struct {
	Name           string
	Hand           []CardData
	Cards          []CardData
	Deck           []CardData
	Turn           bool
	HP             int
	Def            int
	Mana           int
	CounterOfMoves int
	Hero           string
	HeroTurn       bool
	CardsToAttack  []CardData
}

func NewPlayer(name string, hand, deck, cards, cardsToAttack []CardData, turn bool, hp, def, mana, counterOfMoves int, hero string) *Player {
	return &Player{
		Name:           name,
		Hand:           hand,
		Deck:           deck,
		Cards:          cards,
		Turn:           turn,
		HP:             hp,
		Def:            def,
		Mana:           mana,
		CounterOfMoves: counterOfMoves,
		Hero:           hero,
		HeroTurn:       false,
		CardsToAttack:  cardsToAttack,
	}
}
