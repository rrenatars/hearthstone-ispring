// package main
//
// import (
//
//	"database/sql"
//	"fmt"
//	"log"
//	"net/http"
//
//	_ "github.com/go-sql-driver/mysql"
//	"github.com/jmoiron/sqlx"
//
// )
//
// const (
//
//	port         = ":3000"
//	dbDriverName = "mysql"
//
// )
//
//	func main() {
//		db, err := openDB()
//		if err != nil {
//			log.Fatal(err)
//		}
//
//		dbx := sqlx.NewDb(db, dbDriverName)
//
//		var cards []cardData
//		var deckForExchange []cardData
//
//		mux := http.NewServeMux()
//		mux.HandleFunc("/arena", arena(dbx, &deckForExchange, &cards))
//		log.Println("cards main", cards)
//		mux.HandleFunc("/selecthero", selecthero(dbx))
//		mux.HandleFunc("/menu", menu)
//		mux.HandleFunc("/api/post", exchangeCards(&deckForExchange, &cards))
//
//		mux.Handle("/static/", http.StripPrefix("/static/", http.FileServer(http.Dir("./static"))))
//
//		fmt.Println("Start server")
//		err = http.ListenAndServe(port, mux)
//		if err != nil {
//			log.Fatal(err)
//		}
//	}
//
//	func openDB() (*sql.DB, error) {
//		return sql.Open(dbDriverName, "rrenatessa:sqlwebpassdata@tcp(localhost:3306)/hearthstone?charset=utf8mb4&collation=utf8mb4_unicode_ci&parseTime=true")
//	}
package main

import "github.com/rrenatars/hearthstone-ispring/internal/app"

func main() {
	app.Run()
}
