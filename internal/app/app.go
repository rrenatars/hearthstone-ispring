package app

import (
	"encoding/json"
	"fmt"
	"html/template"
	"log"
	"net/http"
	"strconv"

	"github.com/gorilla/websocket"
	"github.com/rrenatars/hearthstone-ispring/internal/database"
	"github.com/rrenatars/hearthstone-ispring/internal/models"
	"github.com/rrenatars/hearthstone-ispring/internal/services"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin:     func(r *http.Request) bool { return true },
}

type Message struct {
	Type string `json:"type"`
	Data string `json:"data"`
}

func reader(conn *websocket.Conn, gameTable *models.GameTable) {
	for {

		messageType, p, err := conn.ReadMessage()
		if err != nil {
			log.Println(err)
			return
		}

		log.Println(string(p))

		switch string(p) {
		case "end turn":

			gameTable.Player1.Turn = !gameTable.Player1.Turn
			gameTable.Player2.Turn = !gameTable.Player2.Turn

			if gameTable.Player1.Turn && len(gameTable.Player1.Deck) > 0 {
				gameTable.Player1.Hand = append(gameTable.Player1.Hand, gameTable.Player1.Deck[0])
				gameTable.Player1.Deck = gameTable.Player1.Deck[1:]
			}

			if gameTable.Player2.Turn && len(gameTable.Player2.Deck) > 0 {
				gameTable.Player2.Hand = append(gameTable.Player2.Hand, gameTable.Player2.Deck[0])
				gameTable.Player2.Deck = gameTable.Player2.Deck[1:]
			}

			if gameTable.Player2.Turn && len(gameTable.Player2.Hand) > 0 {
				gameTable.Cards = append(gameTable.Cards, gameTable.Player2.Hand[0])
				gameTable.Player2.Hand = gameTable.Player2.Hand[1:]
				gameTable.Player2.Deck = gameTable.Player2.Deck[1:]
			}

			message := Message{
				Type: "turn",
				Data: strconv.FormatBool(gameTable.Player1.Turn),
			}

			jsonMsg, err := json.Marshal(message)
			if err != nil {
				log.Println(err)
				return
			}

			// Send the JSON message to the client
			if err := conn.WriteMessage(messageType, jsonMsg); err != nil {
				log.Println(err)
				return
			}
		case "card drag":
			fmt.Println("two")
		case "":
			fmt.Println("three")
		default:
			fmt.Println("def")
		}

		if err := conn.WriteMessage(messageType, p); err != nil {
			log.Println(err)
			return
		}

	}
}

func createGameTable() *models.GameTable {
	deck, err := database.GetCards()
	if err != nil {
		log.Println(err)
	}

	name := "username"

	player1 := models.Player{
		Name: name,
		Hand: services.GetRandomElementsFromDeck(deck, 3),
		Deck: deck,
		Turn: true,
	}

	player2 := models.Player{
		Name: name,
		Hand: services.GetRandomElementsFromDeck(deck, 3),
		Deck: deck,
		Turn: false,
	}

	obj := models.GameTable{
		Cards:   make([]models.CardData, 0),
		Player1: &player1,
		Player2: &player2,
		History: make([]models.CardData, 0),
	}
	return &obj
}

func arena(w http.ResponseWriter, r *http.Request, gameTable *models.GameTable) {
	ts, err := template.ParseFiles("pages/arena.html")
	if err != nil {
		http.Error(w, "Failed to load template", http.StatusInternalServerError)
		log.Println(err)
		return
	}
	d := *gameTable
	err = ts.Execute(w, d)
	if err != nil {
		http.Error(w, "Failed to render template", http.StatusInternalServerError)
		log.Println(err)
		return
	}
	log.Println("Request completed successfully")
}

func selectHero(w http.ResponseWriter, r *http.Request) {
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

func wsEndpoint(w http.ResponseWriter, r *http.Request, gameTable *models.GameTable) {
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}

	log.Println("Client Connected")
	err = ws.WriteMessage(websocket.TextMessage, []byte("Hi Client!"))
	if err != nil {
		log.Println(err)
	}

	reader(ws, gameTable)
}

func setupRoutes(gameTable *models.GameTable) {
	mux := http.NewServeMux()

	mux.HandleFunc("/", selectHero)

	mux.HandleFunc("/arena", func(w http.ResponseWriter, r *http.Request) {
		arena(w, r, gameTable) // Pass the game table object to the wsEndpoint function
	})

	mux.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		wsEndpoint(w, r, gameTable) // Pass the game table object to the wsEndpoint function
	})

	mux.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir("./static"))))

	err := http.ListenAndServe(":3000", mux)
	if err != nil {
		log.Fatal(err)
	}

}

func Run() {
	gameTable := createGameTable()

	setupRoutes(gameTable)
}
