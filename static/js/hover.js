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

        if ((card.getAttribute("data-specification") === "taunt") && (!(document.querySelector(".cards__card_drag")))) {
            const rect = card.getBoundingClientRect();
            const cardX = rect.left;
            const cardY = rect.top;

            const tauntImg = document.createElement("img")
            tauntImg.src = "../../static/images/field/taunt-image.png"
            tauntImg.classList.add("specification-image")
            setTimeout(function () {
                tauntImg.style.opacity = "1"
            }, 500)
            tauntImg.style.left = cardX - 280 + "px"
            tauntImg.style.top = cardY - 175 + "px"

            document.body.appendChild(tauntImg)
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

        if (document.querySelector(".specification-image")) {
            document.body.removeChild(document.querySelector(".specification-image"))
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
            if ((!(document.querySelector(".activeCard"))) && (!(document.querySelector(".card__drag")))) {
                setTimeout(function () {
                    manabarFillingHover(cardManaValue)
                }, 200)
            }

            setTimeout(function () {
                ability.style.animation = "burn-card-green-white 2s linear infinite alternate"
            }, 100)
        } else {
            setTimeout(function () {
                ability.style.animation = "burn-card-white 2s linear infinite alternate"
            }, 100)
        }

        const urlParams = new URLSearchParams(window.location.search);
        let heroClass = urlParams.get('heroclass');

        if (heroClass === "mage") {
            const rect = ability.getBoundingClientRect();
            const cardX = rect.left;
            const cardY = rect.top;

            const abilityImg = document.createElement("img")
            abilityImg.src = "../../static/images/cards-in-hand/fireblast.png"
            abilityImg.classList.add("ability__image-card")
            setTimeout(function () {
                abilityImg.style.opacity = "1"
            }, 500)
            abilityImg.style.left = cardX - 40 + "px"
            abilityImg.style.top = cardY - 310 + "px"

            document.body.appendChild(abilityImg)
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

        setTimeout(function () {
            ability.style.removeProperty("animation")
        }, 100)

        if (document.querySelector(".ability__image-card")) {
            document.body.removeChild(document.querySelector(".ability__image-card"))
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

            if (!(document.querySelector(".activeCard")) || (!(document.querySelector(".card__card_drag")))) {
                const rect = card.getBoundingClientRect();
                const cardX = rect.left;
                const cardY = rect.top;

                setTimeout(function () {
                    cardImg.style.opacity = "1"
                }, 100)
                cardImg.style.left = cardX + 30 + "px"
                cardImg.style.top = cardY - 200 + "px"
                document.body.appendChild(cardImg)

                if (card.getAttribute("data-specification") === "taunt") {
                    const tauntImg = document.createElement("img")
                    tauntImg.src = "../../static/images/field/taunt-image.png"
                    tauntImg.classList.add("specification-image")
                    setTimeout(function () {
                        tauntImg.style.opacity = "1"
                    }, 500)
                    tauntImg.style.left = cardX + 325 + "px"
                    tauntImg.style.top = cardY - 60 + "px"

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