import { setGame } from "./game.js";

export function ViewCards(cards, parentId, childClassName, childWidth, childHeight) {
    const cardsHand = document.getElementById(parentId);
    while (cardsHand.firstChild) {
        cardsHand.removeChild(cardsHand.firstChild);
    }
    for(const cardInHand of cards)
    {
        let newCardElement = document.createElement('div');

        newCardElement.className = childClassName;
        
        newCardElement.style.width = childWidth;
        newCardElement.style.height = childHeight;
        
        newCardElement.id = `${cardInHand.cardID}`;
        
        newCardElement.style.backgroundImage = `url(../..${cardInHand.portrait})`;
        
        newCardElement.style.backgroundSize = `cover`;
    
        const manaElement = document.createElement('span');

        manaElement.className = "card__mana";
        manaElement.textContent = cardInHand.mana;
        
        newCardElement.appendChild(manaElement);
        cardsHand.appendChild(newCardElement);
    }
    //stateMachine.processEvent("start game");
}