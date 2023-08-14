export function enableToDrag(manaValue) {
    const cards = document.querySelectorAll(".cards__card")

    cards.forEach((card) => {
        if ((manaValue >= parseInt(card.querySelector(".card__mana").textContent)) && (document.querySelectorAll(".field__card").length < 7)) {
            card.classList.add("cards__card_enable-to-drag")
        }
    })
}

export function enableToAttack(cardsToAttack) {
    for (const card of document.querySelectorAll(".field__card")) {
        card.classList.remove("canAttack")
    }

    const cardsOnField = document.querySelectorAll(".field__card")
    for (let i = 0; i < cardsToAttack.length; i++) {
        for (let j = 0; j < cardsOnField.length; j++) {
            if (i === j && cardsToAttack[i].cardID === cardsOnField[j].id) {
                cardsOnField[j].classList.add("canAttack")
            }
        }
    }
}

export function vulnerableToAttack(vulnerableCards) {
    let isTauntOnField = false

    for (const card of vulnerableCards) {
        if (card.getAttribute("data-specification") === "taunt") {
            isTauntOnField = true

            card.classList.add("field__card_vulnerable")
        }
    }

    if (isTauntOnField) {
        return
    }

    for (const card of vulnerableCards) {
        card.classList.add("field__card_vulnerable")
    }
}