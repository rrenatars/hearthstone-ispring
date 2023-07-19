package rest

import (
	"net/http"

	"github.com/gin-contrib/multitemplate"
	"github.com/gin-gonic/gin"
	"github.com/rrenatars/hearthstone-ispring/internal/models"
)

func BotHandler(c *gin.Context) {
	gameTable := c.MustGet("gameTable").(*models.GameTable)

	render := c.MustGet("render").(multitemplate.Renderer)

	// Добавляем шаблон "bot.html" в мультишаблон
	render.AddFromFiles("bot", "pages/bot.html")

	c.HTML(http.StatusOK, "bot", gameTable)
}

func CommandHandler(c *gin.Context) {
	// Получение данных из формы или JSON-запроса
	// Ваш код для получения данных из формы или JSON-запроса

	// Обработка команды
	// response := processCommand(command)

	// // Отправка ответа
	// c.JSON(http.StatusOK, gin.H{
	// 	"response": response,
	// })
}
