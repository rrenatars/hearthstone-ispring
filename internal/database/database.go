package database

import (
	"database/sql"

	_ "github.com/go-sql-driver/mysql"
	"github.com/jmoiron/sqlx"
	models "github.com/rrenatars/hearthstone-ispring/internal/models"
)

const (
	port         = ":3000"
	dbDriverName = "mysql"
)

func GetCards() ([]models.CardData, error) {
	db, err := openDB()
	if err != nil {
		return []models.CardData{}, err
	}
	dbx := sqlx.NewDb(db, dbDriverName)
	return getCardsFromMySqlDB(dbx)
}

func openDB() (*sql.DB, error) {
	return sql.Open(dbDriverName, "rrenatessa:sqlwebpassdata@tcp(localhost:3306)/hearthstone?charset=utf8mb4&collation=utf8mb4_unicode_ci&parseTime=true")
}

func getCardsFromMySqlDB(db *sqlx.DB) ([]models.CardData, error) {
	const query = `
		SELECT
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
