package rest

import (
	"log"
	"net/http"
	"text/template"

	"github.com/gin-gonic/gin"
	"github.com/rrenatars/hearthstone-ispring/internal/models"
)

func test(c *gin.Context) {
	gameTable := c.MustGet("gameTable").(*models.GameTable)

	ts, err := template.ParseFiles("pages/test.html")
	if err != nil {
		c.String(http.StatusInternalServerError, "Failed to load template")
		log.Println(err)
		return
	}

	if err = ts.Execute(c.Writer, *gameTable); err != nil {
		c.String(http.StatusInternalServerError, "Failed to render template")
		log.Println(err)
		return
	}

	log.Println("Request completed successfully")
}
