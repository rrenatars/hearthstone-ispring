import { GameTable } from "./models.js";

export function createStateMachine(game) {
    let state = 'no-state';
    return {
      getState() {
        return state;
      },
      processEvent(event) {
        switch (state) {
            case "start game":
                let cardsHand = document.getElementsById("cards")
               // let cardInCardsHand = document.getElementsById("cards__card")
                for(const cardInHand of game.player1.Hand)
                {
                    console.log(cardInHand)
                    let newCardElement = document.createElement("cards__card");
                    newCardElement.className = "cards__card";
                    newCardElement.style.width = '94px';
                    newCardElement.style.height = '135px';
                    newCardElement.id = cardInHand.Id
                    newCardElement.style.background = url(`${cardInHand.Portrait}`);
                    newCardElement.style.backgroundSize = cover 
                    cardsHand.appendChild(newCardElement);
                }
                break
            case 'idle':
                if (event === 'start') {
                    state = 'running';
                }
                break;
            case 'running':
                if (event === 'stop') {
                    state = 'stopped';
                }
                break;
            case 'stopped':
                if (event === 'start') {
                    state = 'running';
                }
                break;
          default:
                break;
        }
      },
    };
  }


export let game = new GameTable()
export function setGame(game_)
{
    game = game_
} 
export let stateMachine = createStateMachine(game);
