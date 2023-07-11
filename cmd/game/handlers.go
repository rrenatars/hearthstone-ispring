package main

import (
	"html/template"
	"log"
	"math/rand"
	"net/http"
	"time"

	"github.com/jmoiron/sqlx"
)

type creatureData struct {
	Name          string `db:"name"`
	Attack        int    `db:"attack"`
	Defense       int    `db:"defense"`
	Portrait      string `db:"portrait"`
	CardID        string `db:"card_id"`
	Specification string `db:"specification"`
}

type arenaPageData struct {
	Cards    []cardData
	Deck     []cardData
	Creature []creatureData
}

type cardData struct {
	Name          string `db:"name"`
	Mana          int    `db:"mana"`
	Attack        int    `db:"attack"`
	Defense       int    `db:"defense"`
	Portrait      string `db:"portrait"`
	CardID        string `db:"card_id"`
	Specification string `db:"specification"`
}

func arena(db *sqlx.DB) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		//cards, err := cards(db)
		// if err != nil {
		// 	http.Error(w, "Internal Server Error", 500)
		// 	log.Println(err)
		// 	return
		// }

		deck, err := deck(db)
		if err != nil {
			http.Error(w, "Internal Server a Error", 500)
			log.Println(err)
			return
		}

		creature, err := creatures(db)
		if err != nil {
			http.Error(w, "Internal Server a Error", 500)
			log.Println(err)
			return
		}

		cards := GetRandomElements(deck, 3)

		ts, err := template.ParseFiles("pages/arena.html")
		if err != nil {
			http.Error(w, "Internal Server Error", 500)
			log.Println(err)
			return
		}

		data := arenaPageData{
			Cards:    cards,
			Deck:     deck,
			Creature: creature,
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

func selecthero(db *sqlx.DB) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		ts, err := template.ParseFiles("pages/selecthero.html")
		if err != nil {
			http.Error(w, "Internal Server Error", 500)
			log.Println(err)
			return
		}
		f := 1
		err = ts.Execute(w, f)
		log.Println("Request completed successfully")
	}
}

func GetRandomElements(arr []cardData, numElements int) []cardData {
	rand.Seed(time.Now().UnixNano())

	if numElements > len(arr) {
		numElements = len(arr)
	}

	result := make([]cardData, numElements)

	for i := 0; i < numElements; i++ {
		randomIndex := rand.Intn(len(arr))
		result[i] = arr[randomIndex]
	}

	return result
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

func creatures(db *sqlx.DB) ([]creatureData, error) {
	const query = `
		SELECT
			name,
			attack,
			defense,
			portrait
		FROM
			creature
	`

	var creatures []creatureData

	err := db.Select(&creatures, query)
	if err != nil {
		return nil, err
	}

	return creatures, nil
}

func deck(db *sqlx.DB) ([]cardData, error) {
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

	var deck []cardData

	err := db.Select(&deck, query)
	if err != nil {
		return nil, err
	}

	return deck, nil
}
