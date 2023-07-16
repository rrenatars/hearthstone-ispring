package app

import (
	"log"
	"net/http"

	"github.com/rrenatars/hearthstone-ispring/internal/database"
	"github.com/rrenatars/hearthstone-ispring/internal/models"
	"github.com/rrenatars/hearthstone-ispring/internal/services"
	"github.com/rrenatars/hearthstone-ispring/internal/transport/rest"
)

func setupRoutes(gameTable *models.GameTable) {
	mux := http.NewServeMux()

	mux.HandleFunc("/", rest.SelectHero)

	mux.HandleFunc("/arena", func(w http.ResponseWriter, r *http.Request) {
		rest.Arena(w, r, gameTable)
	})

	mux.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		rest.WsEndpoint(w, r, gameTable)
	})

	mux.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir("./static"))))

	err := http.ListenAndServe(":3000", mux)
	if err != nil {
		log.Fatal(err)
	}

}

func Run() {
	db, err := database.OpenDB()
	if err != nil {
		log.Println("data base err: ", err.Error())
	}

	deck, err := database.GetDeckFromMySqlDB(db)
	if err != nil {
		log.Printf("deck err: %s\n%v", err.Error(), deck)
	}

	pl1 := services.NewPlayer("name", services.GetRandomElementsFromDeck(deck, 3), deck, []models.CardData{}, true, 100, 100)

	pl2 := services.NewPlayer("name", services.GetRandomElementsFromDeck(deck, 3), deck, []models.CardData{}, false, 100, 100)

	gameTable := services.NewGameTable(pl1, pl2, []models.CardData{})

	setupRoutes(gameTable)
}
