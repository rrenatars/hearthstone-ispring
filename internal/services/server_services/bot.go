package serverservices

import (
	"log"
	"strings"

	"github.com/rrenatars/hearthstone-ispring/internal/models"
)

func Bot(g *models.GameTable) {
	if g.Player1.Name == "bot" {
		calculateOptimalMove(g, g.Player1)
		return
	}

	if g.Player2.Name == "bot" {
		calculateOptimalMove(g, g.Player2)
		return
	}

	log.Println("error, the bot did not understand which of their 2 players")
}

func calculateOptimalMove(g *models.GameTable, p *models.Player) {
	receivesCardInDeck(p)

	for len(p.Hand) > 0 && len(p.Cards) <= 7 && p.Mana-p.Hand[0].Mana >= 0 {
		p.Mana -= p.Hand[0].Mana
		p.Hand[0].Portrait = strings.Replace(p.Hand[0].Portrait, "cards-in-hand", "creatures", 1)
		p.Cards = append(p.Cards, p.Hand[0])
		p.Hand = removeElemsFromSlice(p.Hand, 0)
	}

	if p.Name == g.Player1.Name {
		botAttack(p, g.Player2)
	}
	log.Println(g.Player2.Cards)

	if p.Name == g.Player2.Name {
		botAttack(p, g.Player1)
	}
	log.Println(g.Player1.Cards)
}

func botAttack(bot *models.Player, player *models.Player) {
	if botAttackPlayer(bot, player, botAttackPlayerCards(bot, player)) {
		log.Println("bot win")
	}
	log.Println(player.Cards)
}

func botAttackPlayer(bot *models.Player, player *models.Player, i_ int) bool {
	log.Println(player.HP)
	for i_ >= 0 {
		player.HP -= bot.Cards[i_].Attack
		log.Println(player.HP)
		if player.HP < 0 {
			return true
		}
		i_--
	}
	return false
}

func botAttackPlayerCards(bot *models.Player, player *models.Player) int {
	i_ := 0
	for a := 0; a < len(player.Cards); a++ {
		if player.Cards[a].Specification == "taunt" {
			i := len(bot.Cards) - 1
			for player.Cards[a].HP > 0 && i >= 0 {
				player.Cards[a].HP -= bot.Cards[i].Attack
				log.Println(player.Cards[a].Portrait, player.Cards[a].HP)
				i--
				i_ = i
			}
		}
	}
	log.Println("фор", player.Cards)
	return i_
}

func receivesCardInDeck(player *models.Player) {
	//получение 1 карты в руки из колоды
	if len(player.Deck) != 0 && len(player.Hand) <= 5 {
		player.Hand = append(player.Hand, player.Deck[0])
		player.Deck = player.Deck[1:]
		return
	}
	//если колода пустая то игрок теряет хп, но получает карту
	player.HP -= (player.CounterOfMoves - 30)
}
