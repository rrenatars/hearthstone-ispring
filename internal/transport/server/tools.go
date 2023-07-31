package server

import "log"

func addClientToMap(client *Client, clients map[string]*Client, clientsHistory map[string]bool) {
	clients[client.id] = client
	clientsHistory[client.id] = true
	log.Println("client registtrate in hub")
}

func deleteClientFromMap(client *Client, clients map[string]*Client, clientsHistory map[string]bool) {
	if _, ok := clients[client.id]; ok {
		clientsHistory[client.id] = false
		delete(clients, client.id)
		// close(client.send)
		log.Println("client unregisttrate")
	}
	log.Println("::client unregisttrate")
}

func sortOutClients(message []byte, clients map[string]*Client) {
	for clientID, client := range clients {
		select {
		case client.send <- message:
			log.Println("client : ", message)
		default:
			close(client.send)
			delete(clients, clientID)
		}
	}
}

func getClientByID(clientID string, clients map[string]*Client) *Client {
	for _, client := range clients {
		if client.conn != nil && client.conn.LocalAddr().String() == clientID {
			return client
		}
	}
	return nil
}
