import {CardData, GameTable, Player} from "./models.js";

import {game, setGame, stateMachine} from "./game.js"
import {ViewCards} from "./view.js";

import {dragNDrop} from "./dragndrop.js";
import {manabarFilling} from "./manabarFilling.js";

export const socket = new WebSocket("ws://localhost:3000/ws");

const endTurnButton = document.getElementById('endturn');

function selectCardsToExchange() {
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
                        img.src = "/static/images/cross.png";
                        card.appendChild(img); // Добавляем img только если его еще нет
                    }
                }
            }
        });
    });
}

function startBefore() {
    const urlParams = new URLSearchParams(window.location.search);
    const heroClass = urlParams.get('heroclass');
    const selectedHeroElement = document.getElementById('selectedHero');
    selectedHeroElement.style.backgroundImage = 'url(../static/images/field/' + heroClass + '.png)';
    const selectedHeroPowerElement = document.getElementById('heropower');
    selectedHeroPowerElement.style.backgroundImage = 'url(../static/images/field/' + heroClass + 'power.png)';
    const heroHealthElement = document.getElementById('Player1HealthValue');
    let player1HealthValue = parseInt(heroHealthElement.textContent);
    const opponentHeroElement = document.getElementById('opponenthero');
    const opponentheroHealthElement = document.getElementById('Player2HealthValue');
    let player2HealthValue = parseInt(opponentheroHealthElement.textContent);
    const winImage = document.getElementById('winimg');
    const loseImage = document.getElementById('loseimg');
    const endbg = document.getElementById('endbg');

    const manaElement = document.getElementById("MyMana")
    manabarFilling(10, manaElement);

    let cards = document.querySelectorAll('.cards__card')
    const startSubmit = document.getElementById('StartSubmit')

    if (startSubmit) {
        for (let i = 0; i < cards.length; i++) {
            cards[i].classList.add('cards__card_start');
        }

        selectCardsToExchange()
    }
}

function start() {
    const hand = document.querySelector('.hand-and-manabar__hand');

    const startSubmit = document.getElementById('StartSubmit');
    const cardsHeader = document.querySelector('.cards__header');
    const cards = document.querySelectorAll('.cards__card_start');
    const handCards = document.querySelector('.hand__cards_start');
    if (startSubmit) {
        startSubmit.addEventListener('click', (evt) => {
            hand.classList.remove('hand-and-manabar__hand_start');

            handCards.removeChild(startSubmit);
            handCards.removeChild(cardsHeader);
            handCards.classList.remove('hand__cards_start');

            let replacedCardIds = [];

            Array.prototype.forEach.call(cards, function (card) {
                if (card.classList.contains('cards__card_swap')) {
                    card.classList.remove('cards__card_swap');
                    if (card.lastChild.tagName === 'IMG') {
                        card.removeChild(card.lastChild)
                    }
                    replacedCardIds.push(parseInt(card.getAttribute("data-id")));
                }
            });

            const dataToSend = {
                type: "exchange cards",
                data: replacedCardIds
            }
            socket.send(JSON.stringify(dataToSend))
        })
    }
}

function afterStart() {
    const startSubmit = document.getElementById('StartSubmit');
    if (!startSubmit) {
        var canAttack = new Boolean(false);

        const urlParams = new URLSearchParams(window.location.search);
        const heroClass = urlParams.get('heroclass');
        const selectedHeroElement = document.getElementById('selectedHero');
        selectedHeroElement.style.backgroundImage = 'url(../static/images/field/' + heroClass + '.png)';
        const selectedHeroPowerElement = document.getElementById('heropower');
        selectedHeroPowerElement.style.backgroundImage = 'url(../static/images/field/' + heroClass + 'power.png)';
        const heroHealthElement = document.getElementById('Player1HealthValue');
        let player1HealthValue = parseInt(heroHealthElement.textContent);
        const opponentHeroElement = document.getElementById('opponenthero');
        const opponentheroHealthElement = document.getElementById('Player2HealthValue');
        let player2HealthValue = parseInt(opponentheroHealthElement.textContent);
        const winImage = document.getElementById('winimg');
        const loseImage = document.getElementById('loseimg');
        const endbg = document.getElementById('endbg');

        selectedHeroElement.addEventListener("click", function () {
            console.log('player1 Health Value = ', player1HealthValue);
            if (player1HealthValue <= 0) {
                loseImage.style.backgroundImage = "url(../static/images/field/" + heroClass + "LoseGame.png)";
                loseImage.style.width = "863px";
                loseImage.style.height = "818px";
                loseImage.style.zIndex = 9999;
                loseImage.style.position = "absolute";
                loseImage.style.top = "50%";
                loseImage.style.left = "50%";
                loseImage.style.marginRight = "-50%";
                loseImage.style.transform = "translate(-50%, -50%)";
                endbg.style.zIndex = 999;
                endbg.style.backdropFilter = "blur(3px)";
                endbg.style.textAlign = "center";
                endbg.style.margin = "0";
                endbg.style.width = "100%";
                endbg.style.height = "100%";
                endbg.style.position = "absolute";
                endbg.style.bottom = "0";
                endbg.style.top = "0";
                endbg.style.left = "0";
                endbg.style.right = "0";
                endbg.style.backgroundColor = "#666666";
                endbg.style.opacity = "0.95";
            }
        });
    }
}


socket.onmessage = function (event) {
    const message = JSON.parse(event.data);

    //console.log(message.data)
    //console.log(message.type)

    switch (message.type) {
        case "start game":
            console.log("start game")
            let game_ = ParseDataToGameTable(message.data)
            setGame(game_)
            ViewCards(game.player1.cards, "background__field", "field__empty", "94px", "135px")
            ViewCards(game.player1.hand, "cards", "cards__card cards__card_start", "94px", "135px")
            ViewCards(game.player2.cards, "background__field_opp", "field__empty_opp", "94px", "135px")

            const cardsHand = document.getElementById('cards');

            while (cardsHand.firstElementChild) {
                cardsHand.removeChild(cardsHand.firstElementChild)
            }
            for (const cardInHand of game.player1.hand) {
                console.log(game)
                let newCardElement = document.createElement('div');
                newCardElement.className = "cards__card";
                newCardElement.setAttribute("data-id", `${cardInHand.cardID}`);
                newCardElement.style.backgroundImage = `url(../..${cardInHand.portrait})`
                newCardElement.style.backgroundSize = `cover`;

                const manaElement = document.createElement('span');
                manaElement.className = "card__mana";
                manaElement.textContent = cardInHand.mana;
                newCardElement.appendChild(manaElement);

                const attackElement = document.createElement('span')
                attackElement.className = "card__attack"
                attackElement.textContent = cardInHand.attack
                newCardElement.appendChild(attackElement)

                cardsHand.appendChild(newCardElement);
            }
            startBefore()
            start()
            afterStart()

            const startSubmit = document.getElementById("StartSubmit")
            if (!startSubmit) {
                dragNDrop()
            }
            stateMachine.processEvent("start game");
            break;
        // case "drag card":
        //     let cardsInField = ParseDataToCreature(message.data);
        //     let creatureId = cardsInField.creatureID;
        //     let portraitUrl = cardsInField.portrait;
        //
        //     const field = document.getElementById("background__field");
        //     let creaturesList = field.querySelectorAll(`[data-id="${creatureId}"]`);
        //     creaturesList.forEach((creature) => {
        //         // Применяем background-image к элементам с соответствующим data-id
        //         if (creatureId == cardsInField.creatureID) {
        //             creature.style.backgroundImage = `url('${portraitUrl}')`;
        //             creature.style.width = '125px';
        //             creature.style.height = '168px'
        //         }
        //     });
        //     console.log("cardsInField", cardsInField)
        //     break
        case "turn":
            console.log(message);
            let game__ = ParseDataToGameTable(message.data);
            setGame(game__)
            // ViewCards(game.player1.hand, "cards", "cards__card cards__card_start","94px","135px")
            const cardPlayer2 = document.getElementById('background__field_opp');
            setTimeout(function () {
                while (cardPlayer2.firstElementChild) {
                    cardPlayer2.removeChild(cardPlayer2.firstElementChild)
                }
                for (const cardOnTable of game.player2.cards) {
                    console.log(cardOnTable)
                    let newCardElement = document.createElement('div');
                    newCardElement.className = "field__empty_opp";
                    newCardElement.style.width = '94px';
                    newCardElement.style.height = '135px';
                    newCardElement.setAttribute("data-id", `${cardOnTable.cardID}`);
                    newCardElement.style.backgroundImage = `url(../..${cardOnTable.portrait})`
                    newCardElement.style.backgroundSize = `cover`;

                    const hpElement = document.createElement("span")
                    hpElement.textContent = cardOnTable.hp
                    newCardElement.appendChild(hpElement)
                    newCardElement.style.zIndex = "2";

                    cardPlayer2.appendChild(newCardElement);
                }
                // if (!game.player1.turn) {
                //     const dataToSend = {
                //         type: "end turn",
                //         data: {}
                //     }
                //     socket.send(JSON.stringify(dataToSend));
                // }
                if (!game.player1.turn) {
                    endTurnButton.style.backgroundImage = "url(../../static/images/field/endturn1.png)";
                    document.body.style.cursor = "url(../static/images/cursor/cursor.png) 10 2, auto";
                    endTurnButton.removeAttribute('disabled');
                    const manaElement = document.getElementById("MyMana")
                    manabarFilling(10, manaElement)
                    const dataToSend = {
                        type: "end turn",
                        data: {}
                    }
                    socket.send(JSON.stringify(dataToSend));
                }
                stateMachine.processEvent("turn");
            }, 1500);

            break;
        default :
            break;
    }
};

socket.onopen = () => {
    console.log('Соединение установлено');

    // Отправка сообщения на сервер
    const dataToSend = {
        type: "Привет, сервер",
        data: {}
    }
    socket.send(JSON.stringify(dataToSend));
};

socket.onclose = (event) => {
    console.log('Соединение закрыто:', event.code, event.reason);
};

socket.onerror = (error) => {
    console.error('Ошибка соединения:', error);
};

function ParseDataToGameTable(data) {
    return new GameTable(
        ParseDataToPlayer(data.Player1),
        ParseDataToPlayer(data.Player2),
        ParseDataToCards(data.History),
    )
}

function ParseDataToPlayer(data) {
    return new Player(
        data.Name,
        ParseDataToCards(data.Hand),
        ParseDataToCards(data.Cards),
        ParseDataToCards(data.Deck),
        data.Turn,
        data.HP,
        data.Def,
    )
}

function ParseDataToCard(data) {
    return new CardData(
        data.Name,
        data.Portrait,
        data.CardID,
        data.Specification,
        data.Mana,
        data.Attack,
        data.Defense,
    );
}

function ParseDataToCards(data) {
    let newCards = [];
    for (const card of data) {
        newCards.push(ParseDataToCard(card));
    }
    return newCards;
}