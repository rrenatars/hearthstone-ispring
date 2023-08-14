import {manabarFilling, manabarFillingHover} from "./manabar-filling.js";

export function yourTurn() {
    let yourTurnElement = document.createElement("img")

    yourTurnElement.classList.add("your-turn")
    yourTurnElement.src = "../../static/images/field/your-turn.png"
    document.body.append(yourTurnElement)

    setTimeout(function () {
        document.body.removeChild(document.querySelector(".your-turn"))
    }, 2000)
}

export function selectCardsToExchange() {
    const cardsStart = document.querySelectorAll('.cards__card_start');

    Array.from(cardsStart).forEach(function (card) {
        let img = null; // Флаг для отслеживания состояния элемента img
        card.addEventListener('click', function () {
            if (card.classList.contains('cards__card_swap')) {
                card.classList.remove('cards__card_swap');
                if (img) {
                    card.removeChild(img); // Удаляем img только если он был добавлен ранее
                    img = null; // Сбрасываем флаг
                }
            } else {
                if (card.classList.contains('cards__card_start')) {
                    card.classList.add('cards__card_swap');
                    if (!img) {
                        img = document.createElement("img");
                        img.classList.add("cross")
                        img.src = "/static/images/cross.png";
                        card.appendChild(img); // Добавляем img только если его еще нет
                    }
                }
            }
        });
    });
}

export function mouseOver(game, elements, clientId) {
    function handleMouseOver(event) {
        let card = event.target

        if (card.classList.contains("cards__card_enable-to-drag")) {
            const cardManaValue = parseInt(card.querySelector(".card__mana").textContent)
            if (cardManaValue > 0) {
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

    // Добавляем обработчик события для каждого элемента из коллекции cards
    elements.forEach((element) => {
        element.addEventListener("mouseover", handleMouseOver);
    });
}