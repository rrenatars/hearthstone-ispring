package rest

import (
	"log"
	"net/http"
	"strings"
	"text/template"

	"github.com/rrenatars/hearthstone-ispring/internal/transport/server"

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

func ginWsServe(hub *server.Hub) gin.HandlerFunc {
	return gin.HandlerFunc(func(c *gin.Context) {
		server.ServeWs(hub, c.Writer, c.Request)
	})
}

func (h *Handler) InitRoutes(gameTable *models.GameTable) *gin.Engine {
	hub := server.NewHub()
	go hub.Run()
	router := gin.New()

	// htmlRender := multitemplate.NewRenderer()
	// router.HTMLRender = htmlRender

	// router.LoadHTMLGlob("../../../pages")

	router.Use(RealClientIPMiddleware())
	router.Use(SetGameTableContext(gameTable))
	//router.Use(SetRenderContext(htmlRender))

	router.GET("/", authPage)

	// auth группа маршрутов без middleware аутентификации
	auth := router.Group("/auth")
	{
		auth.POST("/sign-up", h.signUp)
		auth.POST("/sign-in", h.signIn)
	}

	// auth GET маршруты без middleware аутентификации
	router.GET("/auth/sign-up", func(c *gin.Context) {
		ts, err := template.ParseFiles("pages/sign-up.html")
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

	router.GET("/auth/sign-in", func(c *gin.Context) {
		ts, err := template.ParseFiles("pages/sign-in.html")
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
	router.Static("/static", "./static")
	// Добавление middleware для аутентификации пользователя
	protected := router.Group("/protected", h.userIdentity)
	{

	}

	// protected GET маршрут с middleware аутентификации
	protected.GET("/", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "You have access to the protected endpoint!",
		})
	})

	router.GET("/test", test)

	router.GET("/menu", h.menu)
	// Остальные маршруты без middleware аутентификации
	router.GET("/ws", ginWsServe(hub))
	router.GET("/arena", arena)
	router.GET("/bot", BotHandler)
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

func SetUserIdContext(userId int) gin.HandlerFunc {
	return func(c *gin.Context) {
		if userId != 0 {
			c.Set("userId", userId)
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

func (h *Handler) menu(c *gin.Context) {
	ts, err := template.ParseFiles("pages/menu.html")
	if err != nil {
		c.String(http.StatusInternalServerError, "Internal Server Error")
		log.Println(err)
		return
	}

	// Передайте userId в шаблон
	err = ts.Execute(c.Writer, gin.H{})
	if err != nil {
		c.String(http.StatusInternalServerError, "Internal Server Error")
		log.Println(err)
		return
	}

	log.Println("Request completed successfully: menu")
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
