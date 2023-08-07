package server

import (
	"log"
	"strings"

	"github.com/gorilla/websocket"
	"github.com/rrenatars/hearthstone-ispring/internal/models"
	serverservices "github.com/rrenatars/hearthstone-ispring/internal/services/server_services"
	"github.com/rrenatars/hearthstone-ispring/internal/tools"
)

const (
	lenOfDeck = 30
)

func Bot(c *Client) {
	if c.room.game.Player1.Name == "bot" {
		calculateOptimalMove(c.room.game, c.room.game.Player1, c.conn)
		return
	}

	if c.room.game.Player2.Name == "bot" {
		calculateOptimalMove(c.room.game, c.room.game.Player2, c.conn)
		return
	}

	log.Println("error, the bot did not understand which of their 2 players")
}

func calculateOptimalMove(g *models.GameTable, p *models.Player, conn *websocket.Conn) {
	if p.Name == g.Player1.Name {
		botAttack(p, g.Player2, conn, g)
	}

	if p.Name == g.Player2.Name {
		botAttack(p, g.Player1, conn, g)
	}

	receivesCardInDeck(p, g)

	for len(p.Hand) > 0 && len(p.Cards) <= 7 && p.Mana-p.Hand[0].Mana >= 0 {
		p.Mana -= p.Hand[0].Mana
		p.Hand[0].Portrait = strings.Replace(p.Hand[0].Portrait, "cards-in-hand", "creatures", 1)
		p.Cards = append(p.Cards, p.Hand[0])
		//g.History = append(g.History, p.Hand[0])
		p.Hand = serverservices.RemoveElemsFromSlice(p.Hand, 0)
	}
}

func botAttack(bot *models.Player, player *models.Player, conn *websocket.Conn, g *models.GameTable) {
	if botAttackPlayer(bot, player, botAttackPlayerCards(bot, player, conn, g), conn) {
		conn.WriteJSON(models.MessageResponse{
			Type: "bot win",
			Data: *g,
		})
	}
}

func botAttackPlayer(bot *models.Player, player *models.Player, i_ int, conn *websocket.Conn) bool {
	for indexCard := i_; indexCard < len(bot.Cards); indexCard++ {
		player.HP -= bot.Cards[indexCard].Attack
		if player.HP < 0 {
			log.Printf("bot win")
			return true
		}
	}
	return false
}

type BotAttackType struct {
	Type string            `json:"Type"`
	Data BotAttackDataType `json:"Data"`
}

type BotAttackDataType struct {
	IdAttack  string            `json:"IdAttack"`
	IdDefense string            `json:"IdDefense"`
	Game      *models.GameTable `json:"Game"`
}

func botAttackCard(bot *models.Player, indexBotCards int, card *models.CardData, conn *websocket.Conn, g *models.GameTable) (int, []int) {
	var botIds []int
	for indexCard := indexBotCards; indexCard < len(bot.Cards); indexCard++ {
		if card.HP <= 0 {
			return indexCard, botIds
		}

		card.HP -= bot.Cards[indexCard].Attack
		bot.Cards[indexCard].HP -= card.Attack

		if bot.Cards[indexCard].HP <= 0 {
			botIds = append(botIds, indexCard)
			//bot.Cards = tools.RemoveElemsFromSlice(bot.Cards, indexCard)
			g.History = append(g.History, bot.Cards[indexCard])
		}

		// conn.WriteJSON(BotAttackType{
		// 	"bot attack",
		// 	BotAttackDataType{
		// 		"",
		// 		"",
		// 		g,
		// 	},
		// })
	}
	return len(bot.Cards), botIds
}

func botAttackPlayerCards(bot *models.Player, player *models.Player, conn *websocket.Conn, g *models.GameTable) int {
	lenBotCards := 0
	var botIndexes []int
	var deleteCardsIds []int

	for cardIndex := 0; cardIndex < len(player.Cards) && lenBotCards < len(bot.Cards); cardIndex++ {
		if player.Cards[cardIndex].Specification == "taunt" {
			var botIndexes_ []int
			lenBotCards, botIndexes_ = botAttackCard(bot, lenBotCards, &player.Cards[cardIndex], conn, g)
			botIndexes = append(botIndexes, botIndexes_...)
		}
		if player.Cards[cardIndex].HP <= 0 {
			deleteCardsIds = append(deleteCardsIds, cardIndex)
		}
	}

	updateCardsWithZeroHP(&bot.Cards)

	updateCardsWithZeroHP(&player.Cards)

	return lenBotCards
}

func updateCardsWithZeroHP(cardsPtr *[]models.CardData) {
	var newCardsForPlayer []models.CardData
	cards := *cardsPtr

	for _, c := range cards {
		if c.HP > 0 {
			newCardsForPlayer = append(newCardsForPlayer, c)
		}
	}

	*cardsPtr = newCardsForPlayer
}

func receivesCardInDeck(player *models.Player, g *models.GameTable) {
	//получение 1 карты в руки из колоды
	if len(player.Deck) != 0 && len(player.Hand) <= 5 {
		player.Hand = append(player.Hand, player.Deck[0])
		player.Deck = player.Deck[1:]
		return
	}
	//если колода пустая то игрок теряет хп, но получает карту
	player.HP -= (player.CounterOfMoves - lenOfDeck)
	card := tools.GetRandomElementsFromDeck(&g.History, 1)
	player.Hand = append(player.Hand, card[0])
}
