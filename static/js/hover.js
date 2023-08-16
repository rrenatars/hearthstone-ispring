import {manabarFilling, manabarFillingHover} from "./manabar-filling.js";

export function handMouseOver(game, elements, clientId) {
    function handleMouseOver(event) {
        let card = event.target

        if (card.classList.contains("cards__card_enable-to-drag")) {
            const cardManaValue = parseInt(card.querySelector(".card__mana").textContent)
            if ((cardManaValue > 0) && (!(document.querySelector(".activeCard"))) && (!(document.querySelector(".card__drag")))) {
                setTimeout(function () {
                    manabarFillingHover(cardManaValue)
                }, 200)
            }
        }

        card.addEventListener("mouseout", handleMouseOut)
    }

    function handleMouseOut(event) {
        let card = event.target

        if (card.classList.contains("cards__card_enable-to-drag")) {
            const myManaElement = document.getElementById("MyMana")
            if (game.player1.name === clientId) {
                setTimeout(function () {
                    manabarFilling(game.player1.Mana, myManaElement, game.player1.CounterOfMoves)
                }, 200)
            } else {
                setTimeout(function () {
                    manabarFilling(game.player2.Mana, myManaElement, game.player2.CounterOfMoves)
                }, 200)
            }
        }
    }

    elements.forEach((element) => {
        element.addEventListener("mouseover", handleMouseOver);
    });
}

export function abilityMouseOver(game, element, clientId) {
    function handleMouseOver(event) {
        let ability = event.target

        if (ability.classList.contains("cards__card_enable-to-drag")) {
            const cardManaValue = 2
            if ((cardManaValue > 0) && (!(document.querySelector(".activeCard"))) && (!(document.querySelector(".card__drag")))) {
                setTimeout(function () {
                    manabarFillingHover(cardManaValue)
                }, 200)
            }
        }

        ability.addEventListener("mouseout", handleMouseOut)
    }

    function handleMouseOut(event) {
        let ability = event.target

        if (ability.classList.contains("cards__card_enable-to-drag")) {
            const myManaElement = document.getElementById("MyMana")
            if (game.player1.name === clientId) {
                setTimeout(function () {
                    manabarFilling(game.player1.Mana, myManaElement, game.player1.CounterOfMoves)
                }, 200)
            } else {
                setTimeout(function () {
                    manabarFilling(game.player2.Mana, myManaElement, game.player2.CounterOfMoves)
                }, 200)
            }
        }
    }

    element.addEventListener("mouseover", handleMouseOver);
}

export function fieldMouseOver(elements) {
    function handleMouseOver(event) {
        let card = event.target

        let cardPortraitUrl
        if (card.style.backgroundImage) {
            cardPortraitUrl = card.style.backgroundImage.replace("creatures", "cards-in-hand").match(/url\((['"]?)(.*?)\1\)/)[2]

            const cardImg = document.createElement("img")
            cardImg.src = cardPortraitUrl
            cardImg.classList.add("field__image-card")

            if (!(document.querySelector(".activeCard")) && (!(document.querySelector(".card__drag")))) {
                card.style.position = "relative"
                card.style.zIndex = "1000"

                const rect = card.getBoundingClientRect();
                const cardX = rect.left;
                const cardY = rect.top;

                cardImg.style.removeProperty("animation")
                cardImg.style.left = cardX + 30 + "px"
                cardImg.style.top = cardY - 200 + "px"
                document.body.appendChild(cardImg)

                if (card.getAttribute("data-specification") === "taunt") {
                    const tauntImg = document.createElement("img")
                    tauntImg.src = "../../static/images/field/taunt-image.png"
                    tauntImg.classList.add("specification-image")
                    tauntImg.style.left = cardX + 325 + "px"
                    tauntImg.style.top = cardY - 55 + "px"

                    document.body.appendChild(tauntImg)
                }
            }
            if (card.classList.contains("canAttack")) {
                setTimeout(function () {
                    card.style.animation = "burn-card-green-white 2s linear infinite alternate"
                }, 100)
            } else if (!card.classList.contains("field__card_vulnerable")) {
                setTimeout(function () {
                    card.style.animation = "burn-card-white 2s linear infinite alternate"
                }, 100)
            } else if (card.classList.contains("field__card_vulnerable")) {
                setTimeout(function () {
                    card.style.animation = "burn-creature-fire-hover 1.5s linear infinite alternate"
                }, 100)
            }
        }

        card.addEventListener("mouseout", handleMouseOut)
    }

    function handleMouseOut(event) {
        let card = event.target

        if (document.querySelector(".field__image-card")) {
            document.body.removeChild(document.querySelector(".field__image-card"))
            if (document.querySelector(".specification-image")) {
                document.body.removeChild(document.querySelector(".specification-image"))
            }
            card.style.position = ""
            card.style.zIndex = ""
        }

        setTimeout(function () {
            card.style.animation = ""
        }, 100)
    }

    elements.forEach((element) => {
        element.addEventListener("mouseover", handleMouseOver);
    });
}

export function buttonMouseOver(element) {
    function handleMouseOver(event) {
        let elem = event.target

        if (elem.classList.contains("endturn-button_green")) {
            elem.style.animation = "burn-card-green-white 2s linear infinite alternate"
        } else {
            elem.style.animation = "burn-card-white 2s linear infinite alternate"
        }

        elem.addEventListener("mouseout", handleMouseOut)
    }

    function handleMouseOut(event) {
        let elem = event.target

        if (elem.classList.contains("endturn-button_green")) {
            elem.style.animation = "burn-green 2s linear infinite alternate"
        } else {
            elem.style.removeProperty("animation")
        }
    }

    element.addEventListener("mouseover", handleMouseOver);
}