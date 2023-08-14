export function greenButton() {
    const cardsOnField = document.querySelectorAll(".field__card")
    const cardsHand = document.querySelectorAll(".cards__card")

    for (const card of cardsOnField) {
        if (card.classList.contains("canAttack")) {
            return
        }
    }

    for (const card of cardsHand) {
        if (card.classList.contains("cards__card_enable-to-drag")) {
            return
        }
    }

    const endTurnButton = document.getElementById('endturn');
    endTurnButton.classList.add("endturn-button_green")
}