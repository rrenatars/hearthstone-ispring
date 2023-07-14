package rest

import (
	"encoding/json"
	"fmt"
	"html/template"
	"log"
	"net/http"
	"strconv"

	"github.com/rrenatars/hearthstone-ispring/internal/models"
	"github.com/rrenatars/hearthstone-ispring/internal/services"
)

func processObjData(w http.ResponseWriter, r *http.Request, fn interface{}, args ...interface{}) {
	obj := r.Context().Value("obj")

	if data, ok := obj.(*models.GameTable); ok {
		// Обращаемся к полям структуры
		log.Printf("%v", data)
		switch fn := fn.(type) {
		case func():
			fn() // Вызов функции без аргументов
		case func(...interface{}):
			fn(args...) // Вызов функции с аргументами
		default:
			http.Error(w, "Invalid function type", http.StatusInternalServerError)
			return
		}
		// ...
	} else {
		// Обработка ошибки неверного типа объекта
		http.Error(w, "Invalid object type", http.StatusInternalServerError)
		return
	}
}

func TestWithoutArgs() {
	log.Println("TestWithoutArgs called")
}

func TestWithArgs(a, b int) {
	log.Printf("TestWithArgs called with arguments %d and %d", a, b)
}

func Start() http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		processObjData(w, r, func(args ...interface{}) {
			// Обработка аргументов
			for _, arg := range args {
				fmt.Println(arg)
			}
		}, "arg1", 42, true)
		processObjData(w, r, TestWithoutArgs)
		processObjData(w, r, TestWithArgs, 1, 2)
	})
}

func Arena() http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		obj := r.Context().Value("obj")

		if data, ok := obj.(models.GameTable); ok {
			// Обращаемся к полям структуры

			if !data.Player1.Turn {
				data.Player1 = services.PlayerGetCard(data.Player1)
			}
			//log.Printf("%v", data.Player1.Hand)
			if data.Player2.Turn {
				data.Player2 = services.PlayerGetCard(data.Player2)
			}

			ts, err := template.ParseFiles("pages/arena.html")
			if err != nil {
				http.Error(w, "Failed to load template", http.StatusInternalServerError)
				log.Println(err)
				return
			}

			err = ts.Execute(w, data)
			if err != nil {
				http.Error(w, "Failed to render template", http.StatusInternalServerError)
				log.Println(err)
				return
			}
			log.Println("Request completed successfully")
		} else {
			// Обработка ошибки неверного типа объекта
			http.Error(w, "Invalid object type", http.StatusInternalServerError)
			return
		}
	})
}

type Data struct {
	OppTurn bool `json:"oppTurn"`
}

func TurnEndButton() http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		var d Data
		err := json.NewDecoder(r.Body).Decode(&d)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		obj := r.Context().Value("obj")

		if data, ok := obj.(models.GameTable); ok {
			// Обращаемся к полям структуры
			data.Player1.Turn = !data.Player1.Turn
			data.Player2.Turn = !data.Player2.Turn
			// log.Printf("%f", g.Player1.Turn)
			log.Println("Request completed successfully")
		} else {
			// Обработка ошибки неверного типа объекта
			http.Error(w, "Invalid object type", http.StatusInternalServerError)
			return
		}

		a, err := json.Marshal(d)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.Write(a)
	})
}

type CardDraggedEventData struct {
	Message       string `json:"message"`
	EventTargetID string `json:"evtTargetId"`
}

func CardDrag() http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		var d CardDraggedEventData
		err := json.NewDecoder(r.Body).Decode(&d)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		// create json response from struct
		i, err := strconv.Atoi(d.EventTargetID)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		obj := r.Context().Value("obj")

		if data, ok := obj.(models.GameTable); ok {
			// Обращаемся к полям структуры
			if d.Message == "player1" {
				data.Cards = append(data.Cards, data.Player1.Hand[i])
				data.Player1.Hand = services.RemoveCardFromSlice(data.Player1.Hand, i)
			}

			if d.Message == "player2" {
				data.Player2.Hand = services.RemoveCardFromSlice(data.Player2.Hand, i)
			}
			log.Println("Request completed successfully")
		} else {
			// Обработка ошибки неверного типа объекта
			http.Error(w, "Invalid object type", http.StatusInternalServerError)
			return
		}

		log.Printf("%d", i)
		a, err := json.Marshal(d)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.Write(a)
	})
}
