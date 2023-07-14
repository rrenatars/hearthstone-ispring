package services

import (
	"math/rand"
	"time"

	models "github.com/rrenatars/hearthstone-ispring/internal/models"
)

func PlayerGetCard(p *models.Player) *models.Player {
	if len(p.Deck) == 0 {
		return p // Возвращаем текущий объект Player, если колода пуста
	}

	newCard := p.Deck[0]        // Получаем первую карту из колоды
	remainingDeck := p.Deck[1:] // Создаем новый срез колоды без первой карты

	return &models.Player{
		Name: p.Name,
		Hand: append(p.Hand, newCard), // Добавляем новую карту в руку
		Deck: remainingDeck,           // Устанавливаем обновленный срез колоды
		Turn: p.Turn,
		HP:   p.HP,
		Def:  p.Def,
	}
}

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

type Data struct {
	OppTurn bool `json:"oppTurn"`
}

func RemoveCardFromSlice(cards []models.CardData, index int) []models.CardData {
	// Проверка допустимого индекса
	if index < 0 || index >= len(cards) {
		return cards // Индекс недопустим, возвращаем исходный срез
	}

	// Удаление элемента из среза
	return append(cards[:index], cards[index+1:]...)
}
