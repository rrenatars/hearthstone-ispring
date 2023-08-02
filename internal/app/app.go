package app

import (
	"log"

	"github.com/rrenatars/hearthstone-ispring/internal/database"
	"github.com/rrenatars/hearthstone-ispring/internal/models"
	"github.com/rrenatars/hearthstone-ispring/internal/services"
	"github.com/rrenatars/hearthstone-ispring/internal/tools"
	"github.com/rrenatars/hearthstone-ispring/internal/transport/rest"
)

type Game struct {
	GameTable *models.GameTable
}

func Run() {
	db, err := database.NewMySQLDB(database.Config{
		Host:     "localhost",
		Port:     "3306",
		Username: "rrenatessa",
		DBName:   "hearthstone",
		//SSLMode:  viper.GetString("db.sslmode"),
		Password:     "sqlwebpassdata",
		DbDriverName: "mysql",
	})

	if err != nil {
		log.Println("new mysql db err: ", err)
		return
	}

	repos := database.NewRepository(db)
	services := services.NewService(repos)
	handlers := rest.NewHandler(services)

	deck, err := database.GetDeckFromMySqlDB(db)
	if err != nil {
		log.Printf("get deck from mysql err: %s\n%v", err.Error(), deck)
		return
	}

	pl1 := models.NewPlayer("name", tools.GetRandomElementsFromDeck(deck, 3), deck, []models.CardData{}, true, 30, 100, 1, 1)
	pl2 := models.NewPlayer("name", tools.GetRandomElementsFromDeck(deck, 3), deck, []models.CardData{}, false, 30, 100, 1, 1)
	gameTable := models.NewGameTable(pl1, pl2, []models.CardData{}, "")

	var games []Game

	games = append(games, Game{GameTable: gameTable})

	handlers.InitRoutes(games[0].GameTable)
}
