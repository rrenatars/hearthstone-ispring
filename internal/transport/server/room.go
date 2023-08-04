package server

import (
	"sync"

	"github.com/rrenatars/hearthstone-ispring/internal/models"
)

const (
	bot         = true
	multiplayer = false
)

type Room struct {
	id             string
	register       chan *Client
	unregister     chan *Client
	broadcast      chan []byte
	bot            bool
	clients        map[string]*Client
	clientsHistory map[string]bool
	game           *models.GameTable
	mu             sync.Mutex
}

func newRoom(name string, g *models.GameTable, b bool) *Room {
	return &Room{
		id:             name,
		register:       make(chan *Client),
		unregister:     make(chan *Client),
		broadcast:      make(chan []byte),
		bot:            b,
		clients:        make(map[string]*Client),
		clientsHistory: make(map[string]bool),
		game:           g,
	}
}

func (r *Room) registerClient(client *Client) {
	r.mu.Lock()
	defer r.mu.Unlock()

	addClientToMap(client, r.clients, r.clientsHistory)
}

func (r *Room) unregisterClient(client *Client) {
	r.mu.Lock()
	defer r.mu.Unlock()

	deleteClientFromMap(client, r.clients, r.clientsHistory)
}

func (r *Room) getClientByID(clientID string) *Client {
	r.mu.Lock()
	defer r.mu.Unlock()

	return getClientByID(clientID, r.clients)
}

func (r *Room) textEveryone(message []byte) {
	r.mu.Lock()
	defer r.mu.Unlock()

	sortOutClients(message, r.clients)
}

func (r *Room) run() {
	for {
		select {
		case client := <-r.register:
			r.registerClient(client)
		case client := <-r.unregister:
			r.unregisterClient(client)
		case message := <-r.broadcast:
			r.textEveryone(message)
		}
	}
}
