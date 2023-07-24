package rest

import (
	"log"
	"net/http"
	"strings"
	"text/template"

	"github.com/gin-contrib/multitemplate"
	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"github.com/rrenatars/hearthstone-ispring/internal/models"
	"github.com/rrenatars/hearthstone-ispring/internal/services"
)

type Handler struct {
	services *services.Service
	upgrader *websocket.Upgrader
}

func NewHandler(services *services.Service) *Handler {
	upgrader := &websocket.Upgrader{
		CheckOrigin: func(r *http.Request) bool {
			return true // Разрешаем соединения с любых источников
		},
	}

	return &Handler{services: services, upgrader: upgrader}
}

func (h *Handler) InitRoutes(gameTable *models.GameTable) *gin.Engine {
	router := gin.New()

	// htmlRender := multitemplate.NewRenderer()
	// router.HTMLRender = htmlRender

	// router.LoadHTMLGlob("../../../pages")

	router.Use(RealClientIPMiddleware())
	router.Use(SetGameTableContext(gameTable))
	//router.Use(SetRenderContext(htmlRender))

	auth := router.Group("/auth")
	{
		auth.POST("/sign-up", h.signUp)
		auth.POST("/sign-in", h.signIn)

		auth.GET("/sign-up", func(c *gin.Context) {
			ts, err := template.ParseFiles("pages/signUp.html")
			if err != nil {
				c.String(http.StatusInternalServerError, "Internal Server Error")
				log.Println(err)
				return
			}
			err = ts.Execute(c.Writer, 1)
			if err != nil {
				c.String(http.StatusInternalServerError, "Internal Server Error")
				log.Println(err)
				return
			}
		})
		auth.GET("/sign-in", func(c *gin.Context) {
			ts, err := template.ParseFiles("pages/signIn.html")
			if err != nil {
				c.String(http.StatusInternalServerError, "Internal Server Error")
				log.Println(err)
				return
			}
			err = ts.Execute(c.Writer, 1)
			if err != nil {
				c.String(http.StatusInternalServerError, "Internal Server Error")
				log.Println(err)
				return
			}
		})
	}

	router.GET("/", selectHero)
	router.GET("/ws", wsEndpoint)
	router.GET("/arena", arena)
	router.GET("/bot", BotHandler)
	router.Static("/static", "./static")
	//router.NoRoute(notFoundHandler)

	err := router.Run(":3000")
	if err != nil {
		log.Fatal(err)
	}

	return router
}

func SetGameTableContext(g *models.GameTable) gin.HandlerFunc {
	return func(c *gin.Context) {
		if g != nil {
			c.Set("gameTable", g)
		}
		c.Next()
	}
}

func SetRenderContext(htmlRender multitemplate.Renderer) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Set("render", htmlRender)
		c.Next()
	}
}

func notFoundHandler(c *gin.Context) {
	c.HTML(http.StatusNotFound, "../pages/404.html", gin.H{})
}

func RealClientIPMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Use X-Forwarded-For header to get the real client IP address.
		if xForwardedFor := c.Request.Header.Get("X-Forwarded-For"); xForwardedFor != "" {
			ips := strings.Split(xForwardedFor, ",")
			c.Set("realClientIP", strings.TrimSpace(ips[0]))
		} else {
			// If X-Forwarded-For header is not set, fall back to the remote address.
			c.Set("realClientIP", c.ClientIP())
		}

		c.Next()
	}
}