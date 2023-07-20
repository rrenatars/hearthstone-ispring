package tools

import (
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
