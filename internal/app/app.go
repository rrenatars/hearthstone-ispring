package app

import (
	"log"

	"github.com/rrenatars/hearthstone-ispring/internal/database"
	"github.com/rrenatars/hearthstone-ispring/internal/models"
	"github.com/rrenatars/hearthstone-ispring/internal/services"
	"github.com/rrenatars/hearthstone-ispring/internal/transport/rest"
)

func Run() {
	db, err := database.OpenDB()
	if err != nil {
		log.Println("data base err: ", err.Error())
	}

	deck, err := database.GetDeckFromMySqlDB(db)
	if err != nil {
		log.Printf("deck err: %s\n%v", err.Error(), deck)
	}

	pl1 := models.NewPlayer("name", services.GetRandomElementsFromDeck(deck, 3), deck, []models.CardData{}, true, 100, 100)
	pl2 := models.NewPlayer("name", services.GetRandomElementsFromDeck(deck, 3), deck, []models.CardData{}, false, 100, 100)
	gameTable := models.NewGameTable(pl1, pl2, []models.CardData{})

	rest.SetupRoutes(gameTable)
}
