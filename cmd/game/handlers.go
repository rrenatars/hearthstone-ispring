package main

import (
	"html/template"
	"log"
	"net/http"

	"github.com/jmoiron/sqlx"
)

type arenaPageData struct {
	Cards []cardData
}

type cardData struct {
	Name     string `db:"name"`
	Mana     int    `db:"mana"`
	Attack   int    `db:"attack"`
	Defense  int    `db:"defense"`
	Portrait string `db:"portrait"`
	CardID   string `db:"card_id"`
}

func arena(db *sqlx.DB) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		cards, err := cards(db)
		if err != nil {
			http.Error(w, "Internal Server Error", 500)
			log.Println(err)
			return
		}

		ts, err := template.ParseFiles("pages/arena.html")
		if err != nil {
			http.Error(w, "Internal Server Error", 500)
			log.Println(err)
			return
		}

		data := arenaPageData{
			Cards: cards,
		}

		err = ts.Execute(w, data)
		if err != nil {
			http.Error(w, "Internal Server Error", 500)
			log.Println(err)
			return
		}

		log.Println("Request completed successfully")
	}
}

func cards(db *sqlx.DB) ([]cardData, error) {
	const query = `
		SELECT
			name,
			mana,
			attack,
			defense,
			portrait
		FROM
			card
	`

	var cards []cardData

	err := db.Select(&cards, query)
	if err != nil {
		return nil, err
	}

	return cards, nil
}
