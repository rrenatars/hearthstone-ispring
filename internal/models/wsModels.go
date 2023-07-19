package models

import "encoding/json"

type MessageResponse struct {
	Type string    `json:"type"`
	Data GameTable `json:"data"`
}

func NewMessageResponse(t string, d GameTable) *MessageResponse {
	return &MessageResponse{
		Type: t,
		Data: d,
	}
}

type MessageRequest struct {
	Type string          `json:"type"`
	Data json.RawMessage `json:"data"`
}

func NewMessageRequest(t string, d json.RawMessage) *MessageRequest {
	return &MessageRequest{
		Type: t,
		Data: d,
	}
}

type CardDragDataType struct {
	CardInHandId string `json:"idCardInHand"`
	Player       bool   `json:"player"`
}

func NewCardDragDataType(id string, p bool) *CardDragDataType {
	return &CardDragDataType{
		CardInHandId: id,
		Player:       p,
	}
}

type ExchangeCardsDataType struct {
	ReplacedCardIds []string `json:"replacedCardIds"`
}
