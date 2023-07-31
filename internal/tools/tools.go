package tools

import (
	"log"
	"math/rand"
	"time"

	"github.com/rrenatars/hearthstone-ispring/internal/database"
	"github.com/rrenatars/hearthstone-ispring/internal/models"
)

func GetRandomElementsFromDeck(arr []models.CardData, numElements int) []models.CardData {
	rand.New(rand.NewSource(time.Now().UnixNano()))

	if numElements > len(arr) {
		numElements = len(arr)
	}

	result := make([]models.CardData, numElements)

	for i := 0; i < numElements; i++ {
		randomIndex := rand.Intn(len(arr))
		result[i] = arr[randomIndex]
	}

	return result
}

func CreateNewGameTable(id_ string) *models.GameTable {
	db, err := database.NewMySQLDB(database.Config{
		Host:         "localhost",
		Port:         "3306",
		Username:     "root",
		DBName:       "hearthstone",
		Password:     "password",
		DbDriverName: "mysql",
	})
	if err != nil {
		log.Printf("db err:", err.Error())
		return &models.GameTable{}
	}
	deck, err := database.GetDeckFromMySqlDB(db)
	if err != nil {
		log.Printf("get deck from mysql err: %s\n%v", err.Error(), deck)
		return &models.GameTable{}
	}

	pl1 := models.NewPlayer("name", GetRandomElementsFromDeck(deck, 3), deck, []models.CardData{}, true, 100, 100)
	pl2 := models.NewPlayer("name", GetRandomElementsFromDeck(deck, 3), deck, []models.CardData{}, false, 100, 100)

	return models.NewGameTable(pl1, pl2, []models.CardData{}, id_)
}
