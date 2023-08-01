export function ViewCards(cards, parentId, childClassName) {
    const cardsHand = document.getElementById(parentId);

    if ((parentId != 'background__field' || parentId != 'background__field_opp') && (cards.length > 0)) {
        while (cardsHand.firstChild) {
            cardsHand.removeChild(cardsHand.firstChild)
        }
    }

    console.log(cards)

    for (const cardInHand of cards) {
        let newCardElement = document.createElement('div');

        newCardElement.className = childClassName;

        newCardElement.id = `${cardInHand.cardID}`;

        newCardElement.style.backgroundImage = `url(../..${cardInHand.portrait})`;
        // newCardElement.style.backgroundSize = "auto auto";

        if (parentId === 'cards') {
            newCardElement.style.backgroundSize = `cover`;
        }
        const manaElement = document.createElement('span');
        manaElement.className = "card__mana";
        manaElement.textContent = cardInHand.mana;
        manaElement.style.display = "inline-block"
        manaElement.style.visibility = "hidden"
        newCardElement.appendChild(manaElement);

        if (!(parentId === 'cards')) {
            const attackElement = document.createElement('span')
            attackElement.className = "card__attack"
            newCardElement.setAttribute("data-specification", cardInHand.specification)
            if ((cardInHand.specification === "taunt") && (parentId != "cards")) {
                attackElement.classList.add("card__attack_taunt")
            } else if ((cardInHand.specification === "poisonous") && (parentId != "cards")) {
                attackElement.classList.add("card__attack_poisonous")
            }

            attackElement.style.display = "inline-block"
            attackElement.textContent = cardInHand.attack
            newCardElement.appendChild(attackElement)

            const hpElement = document.createElement('span')
            hpElement.className = "card__hp"
            newCardElement.setAttribute("data-specification", cardInHand.specification)
            if ((cardInHand.specification === "taunt") && (parentId != "cards")) {
                hpElement.classList.add("card__hp_taunt")
            } else if ((cardInHand.specification === "poisonous") && (parentId != "cards")) {
                hpElement.classList.add("card__hp_poisonous")
            }
            hpElement.style.display = "inline-block"
            hpElement.textContent = cardInHand.hp
            newCardElement.appendChild(hpElement)
        }

        cardsHand.appendChild(newCardElement);
    }
    //stateMachine.processEvent("start game");
}