package database

import (
	"log"

	"github.com/jmoiron/sqlx"
	"github.com/rrenatars/hearthstone-ispring/internal/models"
)

func GetDeckFromMySqlDB(db *sqlx.DB) ([]models.CardData, error) {
	const query = `
		SELECT
			card_id,
			name,
			mana,
			attack,
			defense,
			portrait,
			specification,
			healthpoint
		FROM
			deck
	`

	var deck []models.CardData

	err := db.Select(&deck, query)

	log.Println(deck)
	if err != nil {
		return nil, err
	}

	return deck, nil
}
