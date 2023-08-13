package serverservices

import (
	"encoding/json"
	"errors"
	"log"
	"strings"

	"github.com/rrenatars/hearthstone-ispring/internal/models"
)

func ParseToCardDragDataType(msgReq *models.MessageRequest) (models.CardDragDataType, error) {
	var data models.CardDragDataType

	err := json.Unmarshal(msgReq.Data, &data)
	if err != nil {
		log.Println("Error parsing card drag data:", err.Error())
		return models.CardDragDataType{}, err
	}

	log.Println(data.CardInHandId, " ", data.Player)
	return data, nil
}

func CardDrag(id string, message *models.CardDragDataType, gameTable *models.GameTable) {
	if id == gameTable.Player1.Name {
		// Ход первого игрока
		newPlayer1, err := playerMadeMove(message.CardInHandId, gameTable.Player1)
		if err != nil {
			log.Println(err.Error(), message.CardInHandId, gameTable.Player1.Hand)
			return
		}
		gameTable.Player1 = newPlayer1
		log.Println(gameTable.Player1, "\n", newPlayer1)
		return
	}
	// Ход второго игрока
	newPlayer2, err := playerMadeMove(message.CardInHandId, gameTable.Player2)
	if err != nil {
		log.Println(err.Error())
		return
	}
	log.Println(gameTable.Player2, "\n", newPlayer2)
	gameTable.Player2 = newPlayer2
}

func RemoveElemsFromSlice(cards []models.CardData, index int) []models.CardData {
	if index < 0 || index >= len(cards) {
		return cards
	}

	return append(cards[:index], cards[index+1:]...)
}

func playerMadeMove(id string, pl *models.Player) (*models.Player, error) {
	if len(pl.Hand) == 0 {
		return pl, errors.New("player1 hand is empty")
	}

	index, err := getIndexByCardID(id, pl.Hand)
	if err != nil {
		return pl, err
	}

	newCard := pl.Hand[index]
	newCard.Portrait = strings.Replace(pl.Hand[index].Portrait, "cards-in-hand", "creatures", 1)
	newCards := append(pl.Cards, newCard)
	newHand := RemoveElemsFromSlice(pl.Hand, index)

	newPlayerMana := pl.Mana - newCard.Mana

	newCardsToAttack := pl.CardsToAttack
	if newCard.Specification == "charge" || newCard.Specification == "rush" {
		newCardsToAttack = append(newCardsToAttack, newCard)
	}

	return models.NewPlayer(
		pl.Name,
		newHand,
		pl.Deck,
		newCards,
		newCardsToAttack,
		pl.Turn,
		pl.HP,
		pl.Def,
		newPlayerMana,
		pl.CounterOfMoves,
		pl.Hero,
	), nil
}

func getIndexByCardID(id string, cards []models.CardData) (int, error) {
	for index, value := range cards {
		if value.CardID == id {
			return index, nil
		}
	}
	return -1, errors.New("a card with that ID does not exist")
}
