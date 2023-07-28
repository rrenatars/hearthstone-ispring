package rest

import (
	"log"
	"net/http"
	"text/template"

	"github.com/gin-gonic/gin"
)

func selectHero(c *gin.Context) {
	ts, err := template.ParseFiles("pages/selecthero.html")
	if err != nil {
		c.String(http.StatusInternalServerError, "Internal Server Error")
		log.Println(err)
		return
	}

	f := 1
	err = ts.Execute(c.Writer, f)
	if err != nil {
		c.String(http.StatusInternalServerError, "Internal Server Error")
		log.Println(err)
		return
	}

	log.Println("Request completed successfully : selectHero")
}
