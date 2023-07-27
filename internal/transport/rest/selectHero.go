package rest

import (
	"log"
	"net/http"
	"text/template"

	"github.com/gin-gonic/gin"
)

func selectHero(c *gin.Context) {
	//// Получите userId из контекста
	//userId, err := getUserId(c)
	//if err != nil {
	//	newErrorResponse(c, http.StatusInternalServerError, err.Error())
	//	return
	//}
	//
	//log.Println(userId, "select hero")

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

func selectHeroPost(c *gin.Context) {
	// Получите userId из контекста
	userId, err := getUserId(c)
	if err != nil {
		newErrorResponse(c, http.StatusInternalServerError, err.Error())
		return
	}

	log.Println(userId, "select hero")
}
