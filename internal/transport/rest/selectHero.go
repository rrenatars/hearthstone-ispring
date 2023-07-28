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

	data := struct {
		F int
		//UserId int
	}{
		F: 1,
		//UserId: userId,
	}

	err = ts.Execute(c.Writer, data)
	if err != nil {
		c.String(http.StatusInternalServerError, "Internal Server Error")
		log.Println(err)
		return
	}

	userId, err := getUserId(c)
	if err != nil {
		newErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	log.Println(userId, "select hero")

	log.Println("Request completed successfully : selectHero")
}

func selectHeroPost(c *gin.Context) {
	// Получите userId из контекста
	userId, err := getUserId(c)
	if err != nil {
		newErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	log.Println(userId, "select hero")
}
