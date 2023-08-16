export function greenButton() {
    const cardsOnField = document.querySelectorAll(".field__card")
    const cardsHand = document.querySelectorAll(".cards__card")

    const endTurnButton = document.getElementById('endturn');
    endTurnButton.classList.remove("endturn-button_green")
    endTurnButton.style.removeProperty("animation")

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

    endTurnButton.classList.add("endturn-button_green")
    endTurnButton.style.backgroundImage = "url(../static/images/field/end-turn-green.png)"
    endTurnButton.style.animation = "burn-green 2s linear infinite alternate"
}