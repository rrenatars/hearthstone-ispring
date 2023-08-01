package server

import (
	"sync"

	"github.com/rrenatars/hearthstone-ispring/internal/models"
	"github.com/rrenatars/hearthstone-ispring/internal/tools"
)

type Hub struct {
	rooms          map[string]*Room
	botRooms       map[string]*Room
	clients        map[string]*Client
	clientsHistory map[string]bool
	broadcast      chan []byte
	register       chan *Client
	unregister     chan *Client
	mu             sync.Mutex
}

func NewHub() *Hub {
	return &Hub{
		rooms:          make(map[string]*Room),
		botRooms:       make(map[string]*Room),
		broadcast:      make(chan []byte),
		register:       make(chan *Client),
		unregister:     make(chan *Client),
		clients:        make(map[string]*Client),
		clientsHistory: make(map[string]bool),
	}
}

func (h *Hub) registerClient(client *Client) {
	h.mu.Lock()
	defer h.mu.Unlock()

	addClientToMap(client, h.clients, h.clientsHistory)
}

func (h *Hub) unregisterClient(client *Client) {
	h.mu.Lock()
	defer h.mu.Unlock()

	deleteClientFromMap(client, h.clients, h.clientsHistory)
}

func (h *Hub) getClientByID(clientID string) *Client {
	h.mu.Lock()
	defer h.mu.Unlock()

	return getClientByID(clientID, h.clients)
}

func (h *Hub) TextEveryone(message []byte) {
	h.mu.Lock()
	defer h.mu.Unlock()

	// for roomID, room := range h.rooms {
	// 	select {
	// 	case room.broadcast <- message:
	// 		log.Println("room : ", message)
	// 	default:
	// 		close(room.broadcast)
	// 		delete(h.rooms, roomID)
	// 	}
	// }
	sortOutClients(message, h.clients)
}

func (h *Hub) Run() {
	h.rooms["default"] = newRoom("default", &models.GameTable{})
	for {
		select {
		case client := <-h.register:
			h.registerClient(client)
		case client := <-h.unregister:
			h.unregisterClient(client)
		case message := <-h.broadcast:
			h.TextEveryone(message)
		}
	}
}

func (hub *Hub) deleteRoom(name string) {
	hub.mu.Lock()
	defer hub.mu.Unlock()

	if room, exists := hub.rooms[name]; exists {
		delete(hub.rooms, room.id)
	}
}

func (hub *Hub) getRoom(name string) *Room {
	hub.mu.Lock()
	defer hub.mu.Unlock()

	if room, exists := hub.rooms[name]; exists {
		return room
	}
	return nil
}

func (hub *Hub) createRoom(name string) *Room {
	hub.mu.Lock()
	defer hub.mu.Unlock()

	if _, exists := hub.rooms[name]; !exists {
		room := newRoom(name, tools.CreateNewGameTable(name))
		hub.rooms[name] = room
		return room
	}
	return nil
}

func (h *Hub) getRoomByClientID(clientID string) *Room {
	for _, room := range h.rooms {
		if _, ok := room.clientsHistory[clientID]; ok && room.id != "default" {
			return room
		}
	}
	return nil
}

func (h *Hub) isClientExistByClientID(clientID string) bool {
	if _, ok := h.clientsHistory[clientID]; ok {
		return true
	}
	return false
}
