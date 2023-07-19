package services

import (
	"errors"
	"math/rand"
	"time"

	"github.com/rrenatars/hearthstone-ispring/internal/models"
)

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

func removeElemsFromSlice(cards []models.CardData, index int) []models.CardData {
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
	newCards := append(pl.Cards, pl.Hand[index])
	newHand := removeElemsFromSlice(pl.Hand, index)
	return models.NewPlayer(
		pl.Name,
		newHand,
		pl.Deck,
		newCards,
		pl.Turn,
		pl.HP,
		pl.Def,
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

// Функция для генерации среза случайных индексов
//func GetRandomIndexes(maxIndex, count int) []int {
//	indexes := make([]int, count)
//	for i := 0; i < count; i++ {
//		index := rand.Intn(maxIndex)
//		indexes[i] = index
//	}
//
//	return indexes
//}
//
//func generateRandIndexes(replacedCardIds []string, length int) []int {
//	randIndexes := GetRandomIndexes(length, len(replacedCardIds))
//	for containsAny(randIndexes, replacedCardIds) {
//		randIndexes = GetRandomIndexes(length, len(replacedCardIds))
//	}
//	return randIndexes
//}
//
//func containsAny(randIndexes []int, replacedCardIds []int) bool {
//	for _, index := range randIndexes {
//		for _, replacedCardId := range replacedCardIds {
//			if index == replacedCardId || index == 0 {
//				return true
//			}
//		}
//	}
//	return false
//}
