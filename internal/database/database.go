package database

import (
	_ "github.com/go-sql-driver/mysql"
	"github.com/jmoiron/sqlx"
	"github.com/rrenatars/hearthstone-ispring/internal/models"
)

const (
	port         = ":3000"
	dbDriverName = "mysql"
)

func OpenDB() (*sqlx.DB, error) {
	return sqlx.Open(dbDriverName, "rrenatessa:sqlwebpassdata@tcp(localhost:3306)/hearthstone?charset=utf8mb4&collation=utf8mb4_unicode_ci&parseTime=true")
}

func GetDeckFromMySqlDB(db *sqlx.DB) ([]models.CardData, error) {
	const query = `
		SELECT
			card_id,
			name,
			mana,
			attack,
			defense,
			portrait,
			specification
		FROM
			deck
	`

	var deck []models.CardData

	err := db.Select(&deck, query)
	if err != nil {
		return nil, err
	}

	return deck, nil
}
