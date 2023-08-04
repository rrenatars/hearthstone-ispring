package tools

import (
	"errors"
	"log"
	"math/rand"
	"time"

	"github.com/rrenatars/hearthstone-ispring/internal/database"
	"github.com/rrenatars/hearthstone-ispring/internal/models"
)

func GetCardsFromDB() ([]models.CardData, error) {
	db, err := database.NewMySQLDB(database.Config{
		Host:         "localhost",
		Port:         "3306",
		Username:     "rrenatessa",
		DBName:       "hearthstone",
		Password:     "sqlwebpassdata",
		DbDriverName: "mysql",
	})

	if err != nil {
		return []models.CardData{}, err
	}

	return database.GetDeckFromMySqlDB(db)
}

func GetRandomElementsFromDeck(deckPtr *[]models.CardData, numElements int) []models.CardData {
	rand.New(rand.NewSource(time.Now().UnixNano()))

	deck := *deckPtr
	lenOfDeck := len(deck)

	if numElements > lenOfDeck {
		numElements = lenOfDeck
	}

	result := make([]models.CardData, numElements)
	arrOfRndmIndexes := make([]int, numElements)

	for i := 0; i < numElements; i++ {
		randomIndex := rand.Intn(lenOfDeck)
		result[i] = deck[randomIndex]
		arrOfRndmIndexes[i] = randomIndex
	}

	for _, rndmIndex := range arrOfRndmIndexes {
		deck = RemoveElemsFromSlice(deck, rndmIndex)
	}

	*deckPtr = deck

	return result
}

func CreateNewGameTable(id_ string, b bool) (*models.GameTable, error) {
	deck, err := GetCardsFromDB()
	if err != nil {
		return &models.GameTable{}, err
	}

	if !b {
		return models.NewGameTable(
			models.NewPlayer("name", GetRandomElementsFromDeck(&deck, 3), ShuffleDeck(deck), []models.CardData{}, true, 30, 100, 0, 0),
			models.NewPlayer("name", GetRandomElementsFromDeck(&deck, 3), ShuffleDeck(deck), []models.CardData{}, false, 30, 100, 0, 0),
			[]models.CardData{}, id_), nil
	}

	log.Println("get first hand for bot")
	handForBot, err := GetFirstHandForBot(&deck)
	if err != nil {
		return &models.GameTable{}, err
	}

	log.Println("shafle deck")
	shuflDeck := ShuffleDeck(deck)

	log.Println("get deck agro")
	deckForBot, err := GetDeckAgro(&shuflDeck)
	if err != nil {
		return &models.GameTable{}, err
	}

	log.Println("random number")
	if getRandomNumber(1, 2) == 1 {
		return models.NewGameTable(
			models.NewPlayer("bot", handForBot, deckForBot, []models.CardData{}, true, 30, 100, 0, 0),
			models.NewPlayer("name", GetRandomElementsFromDeck(&deck, 3), ShuffleDeck(deck), []models.CardData{}, false, 30, 100, 0, 0),
			[]models.CardData{}, id_), nil
	}

	return models.NewGameTable(
		models.NewPlayer("name", GetRandomElementsFromDeck(&deck, 3), ShuffleDeck(deck), []models.CardData{}, true, 30, 100, 0, 0),
		models.NewPlayer("bot", handForBot, deckForBot, []models.CardData{}, false, 30, 100, 0, 0),
		[]models.CardData{}, id_), nil
}

func GetFirstHandForBot(deckPtr *[]models.CardData) ([]models.CardData, error) {
	var res []models.CardData

	if c, err := getCardByName(deckPtr, "Wisp"); err == nil {
		res = append(res, c)
	} else {
		return []models.CardData{}, err
	}

	if c, err := GetRandCard([]string{"Shieldbearer", "Goldshire Soldier"}, deckPtr); err == nil {
		res = append(res, c)
	} else {
		return []models.CardData{}, err
	}

	if c, err := GetRandCard([]string{"Rock Rager", "Pompous Actor", "Sharptooth Redgill"}, deckPtr); err == nil {
		res = append(res, c)
	} else {
		return []models.CardData{}, err
	}

	return res, nil
}

func getCardByName(deckPtr *[]models.CardData, name string) (models.CardData, error) {
	deck := *deckPtr

	for i, card := range deck {
		if card.Name == name {
			deck = RemoveElemsFromSlice(deck, i)
			*deckPtr = deck
			return card, nil
		}
	}

	return models.CardData{}, errors.New("this card is didnt exist")
}

func getRandomNumber(min, max int) int {
	rand.Seed(time.Now().UnixNano())
	return rand.Intn(max-min+1) + min
}

func getRandomCardWithMana(deckPtr *[]models.CardData, mana int) models.CardData {
	var manaDeck []models.CardData
	var i_ []int
	deck := *deckPtr

	for i, card := range deck {
		if card.Mana == mana {
			manaDeck = append(manaDeck, card)
			i_ = append(i_, i)
		}
	}

	n := getRandomNumber(0, len(manaDeck)-1)
	*deckPtr = RemoveElemsFromSlice(deck, i_[n])

	return manaDeck[n]
}

func GetRandCard(cardsName []string, deckPtr *[]models.CardData) (models.CardData, error) {
	rand.Seed(time.Now().UnixNano())

	randomIndex := rand.Intn(len(cardsName))
	randomElement := cardsName[randomIndex]

	c, err := getCardByName(deckPtr, randomElement)

	if err != nil {
		for i := 0; i < len(cardsName); i++ {
			c_, err := getCardByName(deckPtr, cardsName[i])
			if err == nil {
				return c_, nil
			}
		}
	}

	return c, nil
}

func ShuffleDeck(deck []models.CardData) []models.CardData {
	rand.Seed(time.Now().UnixNano())

	shuffledDeck := make([]models.CardData, len(deck))
	copy(shuffledDeck, deck)

	for i := range shuffledDeck {
		randomIndex := rand.Intn(len(shuffledDeck)-i) + i

		shuffledDeck[i], shuffledDeck[randomIndex] = shuffledDeck[randomIndex], shuffledDeck[i]
	}

	return shuffledDeck
}

func GetDeckAgro(deckPtr *[]models.CardData) ([]models.CardData, error) {
	var res []models.CardData
	log.Println("1")
	if c, err := GetRandCard([]string{"Scarlet Crusader", "Wolf Rider", "Grizzly Steelmech"}, deckPtr); err == nil {
		res = append(res, c)
	} else {
		return []models.CardData{}, err
	}
	log.Println("2")
	res = append(res, getRandomCardWithMana(deckPtr, 4))
	log.Println("3")
	res = append(res, getRandomCardWithMana(deckPtr, 5))

	log.Println("4")
	if n := getRandomNumber(1, 2); n == 1 {
		log.Println("41")
		c, err := getCardByName(deckPtr, "Boulderfist Ogre")
		if err != nil {
			return []models.CardData{}, err
		}
		res = append(res, c)
	} else {
		log.Println("42")
		res = append(res, getRandomCardWithMana(deckPtr, 4))
	}

	log.Println("5")
	if c, err := GetRandCard([]string{"Scarlet Crusader", "Wolf Rider", "Grizzly Steelmech"}, deckPtr); err == nil {
		res = append(res, c)
	} else {
		return []models.CardData{}, err
	}

	log.Println("6")
	if n := getRandomNumber(1, 2); n == 1 {
		res = append(res, getRandomCardWithMana(deckPtr, 5))
		if c, err := GetRandCard([]string{"Rock Rager", "Pompous Actor", "Sharptooth Redgill"}, deckPtr); err == nil {
			res = append(res, c)
		} else {
			return []models.CardData{}, err
		}
	} else {
		res = append(res, getRandomCardWithMana(deckPtr, 4))
		if c, err := GetRandCard([]string{"Scarlet Crusader", "Wolf Rider", "Grizzly Steelmech"}, deckPtr); err == nil {
			res = append(res, c)
		} else {
			return []models.CardData{}, err
		}
	}

	log.Println("7")
	if err := appendToDeckCard(res, "Power Tank", deckPtr); err != nil {
		return []models.CardData{}, err
	}

	log.Println("8")
	if err := appendToDeckCard(res, "Strong Shoveler", deckPtr); err != nil {
		return []models.CardData{}, err
	}

	log.Println("9")
	if err := appendToDeckCard(res, "Living Monument", deckPtr); err != nil {
		return []models.CardData{}, err
	}

	log.Println("10")
	res = append(res, getCardMaxMana(deckPtr))

	log.Println("11")
	deck := *deckPtr
	for _, c := range deck {
		res = append(res, c)
	}

	return res, nil
}

func appendToDeckCard(result []models.CardData, cardName string, deckPtr *[]models.CardData) error {
	card, err := getCardByName(deckPtr, cardName)
	if err != nil {
		log.Println(err)
		return err
	}
	result = append(result, card)
	return nil
}

func getCardMaxMana(deckPtr *[]models.CardData) models.CardData {
	var maxCard models.CardData
	maxCard.Mana = 0
	var i_ = 0
	deck := *deckPtr

	for i, c := range deck {
		if c.Mana > maxCard.Mana {
			maxCard = c
			i_ = i
		}
	}

	*deckPtr = RemoveElemsFromSlice(deck, i_)
	return maxCard
}

func RemoveElemsFromSlice(cards []models.CardData, index int) []models.CardData {
	if index < 0 || index >= len(cards) {
		return cards
	}

	return append(cards[:index], cards[index+1:]...)
}

func GetIndexByCardID(id string, cards []models.CardData) (int, error) {
	for index, value := range cards {
		if value.CardID == id {
			return index, nil
		}
	}
	return -1, errors.New("a card with that ID does not exist")
}
