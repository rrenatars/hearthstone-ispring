package serverservices

import (
	"encoding/json"
	"log"
	"strings"

	"github.com/google/uuid"
	"github.com/rrenatars/hearthstone-ispring/internal/models"
	"github.com/rrenatars/hearthstone-ispring/internal/tools"
)

const (
	paladinAbID = 1
	warlockAbID = 2
	hunterAbID  = 3
	mageAbID    = 4
	lenOfDeck   = 25
)

type AbilitiesType struct {
	PlyaerId              string                    `json:"PlyaerId"`
	AbilityID             int                       `json:"AbilityID"`
	AdditionalInformation AdditionalInformationType `json:"AdditionalInformation"`
}

type AdditionalInformationType struct {
	Type      string `json:"Type"`
	IdDefense string `json:"IdDefense"`
}

func ParseToAblitiesType(msgReq *models.MessageRequest) (AbilitiesType, error) {
	var data AbilitiesType

	err := json.Unmarshal(msgReq.Data, &data)
	if err != nil {
		log.Println("Error parsing AbilitiesType data:", err.Error())
		return AbilitiesType{}, err
	}

	return data, nil
}

func SetupAbilities(ability *AbilitiesType, g *models.GameTable) {
	switch ability.AbilityID {
	case paladinAbID:
		silverHandRecruit := models.NewCard(
			"Silver Hand Recruit",
			"/static/images/creatures/silver-hand-recruit.png",
			uuid.New().String(),
			"",
			1,
			1,
			1,
			0,
		)

		if g.Player1.Name == ability.PlyaerId {
			g.Player1.Cards = append(g.Player1.Cards, *silverHandRecruit)
			g.Player1.Mana -= 2
		}

		if g.Player2.Name == ability.PlyaerId {
			g.Player2.Cards = append(g.Player2.Cards, *silverHandRecruit)
			g.Player2.Mana -= 2
		}
	case warlockAbID:
		card := tools.GetRandomElementsFromDeck(&g.History, 1)
		if len(card) == 0 {
			var deck = g.Player1.Deck
			card = tools.GetRandomElementsFromDeck(&deck, 1)
		}
		card[0].Portrait = strings.Replace(card[0].Portrait, "cards-in-hand", "creatures", 1)
		if g.Player1.Name == ability.PlyaerId {
			g.Player1.HP -= 2
			g.Player1.Mana -= 2
			if len(g.Player1.Deck) > 0 {
				if len(g.Player1.Hand) <= 5 {
					g.Player1.Hand = append(g.Player1.Hand, g.Player1.Deck[0])
				}
				g.Player1.Deck = g.Player1.Deck[:1]
			} else {
				g.Player1.HP -= (g.Player1.CounterOfMoves - lenOfDeck)
				if len(g.Player1.Hand) <= 5 {
					g.Player1.Hand = append(g.Player1.Hand, card[0])
				}
			}
		}

		if g.Player2.Name == ability.PlyaerId {
			g.Player2.HP -= 2
			g.Player2.Mana -= 2
			if len(g.Player2.Deck) > 0 {
				if len(g.Player2.Hand) <= 5 {
					g.Player2.Hand = append(g.Player2.Hand, g.Player2.Deck[0])
				}
				g.Player2.Deck = g.Player2.Deck[:1]
			} else {
				g.Player2.HP -= (g.Player2.CounterOfMoves - lenOfDeck)
				if len(g.Player2.Hand) <= 5 {
					g.Player2.Hand = append(g.Player2.Hand, card[0])
				}
			}
		}
	case hunterAbID:
		if g.Player1.Name == ability.PlyaerId {
			g.Player2.HP -= 2
			g.Player1.Mana -= 2
		}

		if g.Player2.Name == ability.PlyaerId {
			g.Player1.HP -= 2
			g.Player2.Mana -= 2
		}
	case mageAbID:
		if ability.PlyaerId == g.Player1.Name {
			g.Player1.Mana -= 2
		}

		if ability.PlyaerId == g.Player2.Name {
			g.Player2.Mana -= 2
		}

		var adInf = ability.AdditionalInformation
		// if err := json.Unmarshal(ability.AdditionalInformation, &adInf); err != nil {
		// 	log.Println("Ошибка при парсинге JSON: ", err)
		// }

		if adInf.Type == "attack player" && g.Player1.Name == adInf.IdDefense {
			g.Player1.HP -= 2
		}

		if adInf.Type == "attack player" && g.Player2.Name == adInf.IdDefense {
			g.Player2.HP -= 2
		}

		for _, c := range g.Player1.Cards {
			if c.CardID == adInf.IdDefense {
				c.HP -= 2
			}
		}

		for _, c := range g.Player2.Cards {
			if c.CardID == adInf.IdDefense {
				c.HP -= 2
			}
		}
	default:
		log.Printf("unkown ability id")
	}
}
