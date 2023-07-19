import {CardData, GameTable, Player} from "./models.js";

import {game, setGame, stateMachine} from "./game.js"
import {ViewCards} from "./view.js";

import {dragNDrop} from "./dragndrop.js";
import {manabarFilling} from "./manabarFilling.js";

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
                    replacedCardIds.push(card.id);
                }
            });

            const dataToSend = {
                type: "exchange cards",
                data: {
                    replacedCardIds : replacedCardIds
                }
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

export const socket = new WebSocket("ws://localhost:3000/ws");

export function socketInit() {
    socket.onmessage = function (event) {
        const endTurnButton = document.getElementById('endturn');

        const { type, data } = JSON.parse(event.data);
        setGame(ParseDataToGameTable(data));
        ViewCards(game.player1.cards,"background__field","field__card");
        ViewCards(game.player1.hand, "cards", "cards__card");
        ViewCards(game.player2.cards, "background__field_opp","field__empty_opp");
        dragNDrop()
        switch (type) {
            case "start game":
                startBefore()
                start()
                break;
            case "exchange cards":
                afterStart()
                dragNDrop()
                break
            case "turn":
                dragNDrop()
                if(game.player1.turn)
                {
                    endTurnButton.style.backgroundImage = "url(../../static/images/field/endturn1.png)";
                    endTurnButton.removeAttribute('disabled');
                    //socket.send("end turn")
                }
                break
            default :
                break;
        }
    };

    socket.onopen = () => {
        console.log('Соединение установлено');
    };

    socket.onclose = (event) => {
        console.log('Соединение закрыто:', event.code, event.reason);
    };

    socket.onerror = (error) => {
        console.error('Ошибка соединения:', error);
    };
}

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
        data.HP,
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