package serverservices

import (
	"encoding/json"
	"errors"
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

func SetupAttack(attackData *AttackType, g *models.GameTable) error {
	switch attackData.Player {
	case g.Player1.Name:
		return attack(attackData, g.Player1, g.Player2, &g.History)
	case g.Player2.Name:
		return attack(attackData, g.Player2, g.Player1, &g.History)
	default:
		return errors.New("i dont know this pler")
	}
}

func attack(attackData *AttackType, p *models.Player, o *models.Player, historyPtr *[]models.CardData) error {
	indexCardAttack, err := tools.GetIndexByCardID(attackData.IdAttack, p.Cards)
	if err != nil {
		return err
	}

	if attackData.IdDefense == "opponenthero" {
		o.HP = o.HP - p.Cards[indexCardAttack].Attack
		return nil
	}

	indexCardDef, err := tools.GetIndexByCardID(attackData.IdDefense, o.Cards)
	if err != nil {
		return err
	}

	o.Cards[indexCardDef].HP = o.Cards[indexCardDef].HP - p.Cards[indexCardAttack].Attack
	p.Cards[indexCardAttack].HP = p.Cards[indexCardAttack].HP - o.Cards[indexCardDef].Attack

	if p.Cards[indexCardAttack].Specification == "poisonous" {
		o.Cards[indexCardDef].HP = 0
	}

	if o.Cards[indexCardDef].Specification == "poisonous" {
		p.Cards[indexCardAttack].HP = 0
	}

	var historyValue = *historyPtr
	if o.Cards[indexCardDef].HP <= 0 {
		historyValue = append(historyValue, o.Cards[indexCardDef])
		o.Cards = tools.RemoveElemsFromSlice(o.Cards, indexCardDef)
	}

	if p.Cards[indexCardAttack].HP <= 0 {
		historyValue = append(historyValue, p.Cards[indexCardAttack])
		p.Cards = tools.RemoveElemsFromSlice(p.Cards, indexCardAttack)
	}

	return nil
}

// func Attack(attackData *AttackType, g *models.GameTable) error {
// 	if attackData.Player == g.Player1.Name {
// 		indexCardAttack, err := tools.GetIndexByCardID(attackData.IdAttack, g.Player1.Cards)
// 		if err != nil {
// 			return err
// 		}

// 		if attackData.IdDefense == "opponenthero" {
// 			g.Player2.HP = g.Player2.HP - g.Player1.Cards[indexCardAttack].Attack
// 		} else {
// 			indexCardDef, err := tools.GetIndexByCardID(attackData.IdDefense, g.Player2.Cards)
// 			if err != nil {
// 				return err
// 			}

// 			g.Player2.Cards[indexCardDef].HP = g.Player2.Cards[indexCardDef].HP - g.Player1.Cards[indexCardAttack].Attack
// 			g.Player1.Cards[indexCardAttack].HP = g.Player1.Cards[indexCardAttack].HP - g.Player2.Cards[indexCardDef].Attack

// 			if g.Player1.Cards[indexCardAttack].Specification == "poisonous" {
// 				g.Player2.Cards[indexCardDef].HP = 0
// 			}

// 			if g.Player2.Cards[indexCardDef].Specification == "poisonous" {
// 				g.Player1.Cards[indexCardAttack].HP = 0
// 			}

// 			if g.Player2.Cards[indexCardDef].HP <= 0 {
// 				g.History = append(g.History, g.Player2.Cards[indexCardDef])
// 				g.Player2.Cards = tools.RemoveElemsFromSlice(g.Player2.Cards, indexCardDef)
// 			}
// 			if g.Player1.Cards[indexCardAttack].HP <= 0 {
// 				g.History = append(g.History, g.Player1.Cards[indexCardAttack])
// 				g.Player1.Cards = tools.RemoveElemsFromSlice(g.Player1.Cards, indexCardAttack)
// 			}
// 		}
// 		return nil
// 	}

// 	if attackData.Player == g.Player2.Name {
// 		indexCardAttack, err := tools.GetIndexByCardID(attackData.IdAttack, g.Player2.Cards)
// 		if err != nil {
// 			return err
// 		}

// 		if attackData.IdDefense == "opponenthero" {
// 			g.Player1.HP = g.Player1.HP - g.Player2.Cards[indexCardAttack].Attack
// 		} else {
// 			indexCardDef, err := tools.GetIndexByCardID(attackData.IdDefense, g.Player1.Cards)
// 			if err != nil {
// 				return err
// 			}

// 			g.Player1.Cards[indexCardDef].HP = g.Player1.Cards[indexCardDef].HP - g.Player2.Cards[indexCardAttack].Attack
// 			g.Player2.Cards[indexCardAttack].HP = g.Player2.Cards[indexCardAttack].HP - g.Player1.Cards[indexCardDef].Attack

// 			if g.Player1.Cards[indexCardDef].HP <= 0 {
// 				g.History = append(g.History, g.Player1.Cards[indexCardDef])
// 				g.Player1.Cards = tools.RemoveElemsFromSlice(g.Player1.Cards, indexCardDef)
// 			}

// 			if g.Player2.Cards[indexCardAttack].HP <= 0 {
// 				g.History = append(g.History, g.Player2.Cards[indexCardAttack])
// 				g.Player2.Cards = tools.RemoveElemsFromSlice(g.Player2.Cards, indexCardAttack)
// 			}
// 		}
// 		return nil
// 	}

// 	return errors.New(fmt.Sprintln("i dont know this player: ", attackData.Player))
// }
