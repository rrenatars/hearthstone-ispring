package services

import (
	"math/rand"
	"time"

	"github.com/rrenatars/hearthstone-ispring/internal/models"
)

func NewCard(name, portrait, specification string, mana, cardId, attack, hp, def int) *models.CardData {
	return &models.CardData{
		Name:          name,
		Portrait:      portrait,
		CardID:        cardId,
		Specification: specification,
		Mana:          mana,
		Attack:        attack,
		Defense:       def,
		HP:            hp,
	}
}

func NewPlayer(name string, hand, deck, cards []models.CardData, turn bool, hp, def int) *models.Player {
	return &models.Player{
		Name:  name,
		Hand:  hand,
		Deck:  deck,
		Cards: cards,
		Turn:  turn,
		HP:    hp,
		Def:   def,
	}
}

func NewGameTable(pl1, pl2 *models.Player, history []models.CardData) *models.GameTable {
	return &models.GameTable{
		Player1: pl1,
		Player2: pl2,
		History: history,
	}
}

// Получение карты игроком в руку
func PlayerGetCard(p *models.Player) *models.Player {
	if len(p.Deck) == 0 {
		return p // Возвращаем текущий объект Player, если колода пуста
	}

	newCard := p.Deck[0]
	// remainingDeck := p.Deck[1:]

	remainingDeck := RemoveElemsFromSlice(p.Deck, 1)

	return &models.Player{
		Name: p.Name,
		Hand: append(p.Hand, newCard),
		Deck: remainingDeck,
		Turn: p.Turn,
		HP:   p.HP,
		Def:  p.Def,
	}
}

// Берерт рандомно несколько карт
func GetRandomElementsFromDeck(arr []models.CardData, numElements int) []models.CardData {
	rand.New(rand.NewSource(time.Now().UnixNano()))

	if numElements > len(arr) {
		numElements = len(arr)
	}

	result := make([]models.CardData, numElements)

	for i := 0; i < numElements; i++ {
		randomIndex := rand.Intn(len(arr))
		result[i] = arr[randomIndex]
	}

	return result
}

// Удаляет элементы из слайса карт
func RemoveElemsFromSlice(cards []models.CardData, index int) []models.CardData {
	// Проверка допустимого индекса
	if index < 0 || index >= len(cards) {
		return cards // Индекс недопустим, возвращаем исходный срез
	}

	// Удаление элемента из среза
	return append(cards[:index], cards[index+1:]...)
}
