package models

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
