package server

import (
	"bytes"
	"encoding/json"
	"log"
	"net/http"
	"sync"
	"time"

	"github.com/gorilla/websocket"
	"github.com/rrenatars/hearthstone-ispring/internal/models"
)

const (
	writeWait      = 10 * time.Second
	pongWait       = 60 * time.Second
	pingPeriod     = (pongWait * 9) / 10
	maxMessageSize = 512
)

var (
	newline = []byte{'\n'}
	space   = []byte{' '}
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin:     func(r *http.Request) bool { return true },
}

type Client struct {
	id   string
	hub  *Hub
	room *Room
	conn *websocket.Conn
	send chan []byte
	mu   sync.Mutex
}

func newClient(i string, h *Hub, r *Room, c *websocket.Conn) *Client {
	return &Client{
		id:   i,
		hub:  h,
		room: r,
		conn: c,
		send: make(chan []byte),
	}
}

func (c *Client) readPump() {
	defer func() {
		c.room.unregister <- c
		c.hub.unregister <- c
		c.conn.Close()
		close(c.send)
	}()
	c.conn.SetReadLimit(maxMessageSize)
	c.conn.SetReadDeadline(time.Now().Add(pongWait))
	c.conn.SetPongHandler(func(string) error { c.conn.SetReadDeadline(time.Now().Add(pongWait)); return nil })
	for {
		_, message, err := c.conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("error: %v", err)
			}
			break
		}
		message = bytes.TrimSpace(bytes.Replace(message, newline, space, -1))

		var msgReq models.MessageRequest
		if err := json.Unmarshal(message, &msgReq); err != nil {
			log.Println("error while parsing JSON data: ", err.Error())
			break
		}
		setupMessageTypes(msgReq, c)
	}
}

type Data struct {
	RoomID string
	Game   models.GameTable
}

type CreateGameData struct {
	clientID string `json:"clientID"`
}

type CreateGameMess struct {
	Type string         `json:"type"`
	Data CreateGameData `json:"data"`
}

func (c *Client) writePump() {
	ticker := time.NewTicker(pingPeriod)
	defer func() {
		ticker.Stop()
		c.conn.Close()
	}()
	for {
		select {
		case message, ok := <-c.send:
			c.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if !ok {
				c.conn.WriteMessage(websocket.CloseMessage, []byte{})
				log.Print("error write message conn")
				return
			}
			if err := c.conn.WriteMessage(1, message); err != nil {
				log.Println("msg send err:", err.Error())
			}
			log.Println("send a message")
		case <-ticker.C:
			c.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if err := c.conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				return
			}
		}
	}
}

func ServeWs(hub *Hub, w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		conn.Close()
		return
	}

	clientID := r.URL.Query().Get("clientID")
	if clientID == "" {
		log.Println("client is null, dont have client id", clientID)
		conn.Close()
		return
	}

	var client1 *Client
	client1 = hub.getClientByID(clientID)
	if client1 == nil {
		log.Println("client is nil")
	}
	log.Println("client is find")

	roomID := r.URL.Query().Get("room")
	if roomID == "" {
		log.Println("room default")
		roomID = "default"
	}
	// room := hub.getRoom(roomID)
	// if room == nil {
	// 	log.Println("room is nil: ", roomID)
	// 	conn.WriteJSON("ROOM IS UNDEFINED")
	// 	conn.Close()
	// 	return
	// }
	room := hub.getRoomByClientID(clientID)
	if room == nil || room.id == "default" {
		room = hub.getRoom(roomID)
		if room == nil {
			log.Println("room is nil: ", roomID)
			conn.WriteJSON("ROOM IS UNDEFINED")
			conn.Close()
			return
		}
	}
	log.Println(room.id)

	if room.id != "default" {
		conn.WriteJSON(models.MessageResponse{
			Type: "start game",
			Data: *room.game,
		})
	}

	client := newClient(
		clientID,
		hub,
		room,
		conn,
	)
	go client.room.run()

	client.room.register <- client
	client.hub.register <- client

	log.Println("clients in room len: ", len(client.room.clients))
	log.Println("clients in hub len: ", len(client.hub.clients))

	go client.readPump()
	go client.writePump()
}
