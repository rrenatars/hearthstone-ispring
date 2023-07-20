import { setGame } from "./game.js";

export function ViewCards(cards, parentId, childClassName) {
    const cardsHand = document.getElementById(parentId);
    while (cardsHand.firstChild) {
        cardsHand.removeChild(cardsHand.firstChild);
    }
    for (const cardInHand of cards) {
        let newCardElement = document.createElement('div');

        newCardElement.className = childClassName;

        newCardElement.id = `${cardInHand.cardID}`;

        newCardElement.style.backgroundImage = `url(../..${cardInHand.portrait})`;

        newCardElement.style.backgroundSize = `cover`;

        const manaElement = document.createElement('span');
        manaElement.className = "card__mana";
        manaElement.textContent = cardInHand.mana;
        newCardElement.appendChild(manaElement);

        const hpElement = document.createElement('span')
        hpElement.className = "card__hp"
        hpElement.textContent = cardInHand.hp
        newCardElement.appendChild(hpElement)

        const attackElement = document.createElement('span')
        attackElement.className = "card__attack"
        attackElement.textContent = cardInHand.attack
        newCardElement.appendChild(attackElement)

        cardsHand.appendChild(newCardElement);
    }
    //stateMachine.processEvent("start game");
}