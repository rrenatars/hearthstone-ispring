package serverservices

import (
	"encoding/json"
	"errors"
	"fmt"
	"log"

	"github.com/rrenatars/hearthstone-ispring/internal/models"
	"github.com/rrenatars/hearthstone-ispring/internal/tools"
)

type AttackType struct {
	Player    string `json:"player"`
	IdAttack  string `json:"idAttack"`
	IdDefense string `json:"idDefense"`
}

func ParseToAttackType(msgReq *models.MessageRequest) (*AttackType, error) {
	var attackData AttackType
	if err := json.Unmarshal(msgReq.Data, &attackData); err != nil {
		log.Println("Ошибка при парсинге JSON: ", err)
		return &AttackType{}, err
	}
	//log.Println(attackData)
	return &attackData, nil
}

func Attack(attackData *AttackType, g *models.GameTable) error {
	if attackData.Player == g.Player1.Name {
		indexCardAttack, err := tools.GetIndexByCardID(attackData.IdAttack, g.Player1.Cards)
		if err != nil {
			return err
		}

		log.Println("герой", attackData.IdDefense)
		if attackData.IdDefense == "opponenthero" {
			g.Player2.HP = g.Player2.HP - g.Player1.Cards[indexCardAttack].Attack
		} else {
			indexCardDef, err := tools.GetIndexByCardID(attackData.IdDefense, g.Player2.Cards)
			if err != nil {
				return err
			}

			g.Player2.Cards[indexCardDef].HP = g.Player2.Cards[indexCardDef].HP - g.Player1.Cards[indexCardAttack].Attack

			if g.Player2.Cards[indexCardDef].HP <= 0 {
				g.Player2.Cards = tools.RemoveElemsFromSlice(g.Player2.Cards, indexCardDef)
			}
		}
		log.Println("уменьшается хп", g.Player2.HP)
		return nil
	}

	if attackData.Player == g.Player2.Name {
		indexCardAttack, err := tools.GetIndexByCardID(attackData.IdAttack, g.Player2.Cards)
		if err != nil {
			return err
		}

		if attackData.IdDefense == "opponenthero" {
			g.Player1.HP = g.Player1.HP - g.Player2.Cards[indexCardAttack].Attack
		} else {
			indexCardDef, err := tools.GetIndexByCardID(attackData.IdDefense, g.Player1.Cards)
			if err != nil {
				return err
			}

			g.Player1.Cards[indexCardDef].HP = g.Player1.Cards[indexCardDef].HP - g.Player2.Cards[indexCardAttack].Attack

			if g.Player1.Cards[indexCardDef].HP <= 0 {
				g.Player1.Cards = tools.RemoveElemsFromSlice(g.Player1.Cards, indexCardDef)
			}
		}
		log.Println("уменьшается хп", g.Player1.HP)
		return nil
	}

	return errors.New(fmt.Sprintln("i dont know this player: ", attackData.Player))
}

// func attack(attackData *AttackType, cAttack []models.CardData, cDef []models.CardData) error {
// 	// cardAttack, err := giveCardPtr(attackData.IdAttack, cAttack)
// 	// if err != nil {
// 	// 	return err
// 	// }

// 	//

// 	// indexCardAttack, err := tools.GetIndexByCardID(attackData.IdAttack, cAttack)
// 	// if err != nil {
// 	// 	return err
// 	// }

// 	// indexCardDef, err := tools.GetIndexByCardID(attackData.IdDefense, cDef)
// 	// if err != nil {
// 	// 	return err
// 	// }

// 	// cardDef.HP -= cardAttack.Attack

// if cardDef.HP <= 0 {
// 	index, err := tools.GetIndexByCardID(cardDef.CardID, cAttack)
// 	if err != nil {
// 		return err
// 	}
// 	tools.RemoveElemsFromSlice(cAttack, index)
// }
// return nil
// }
