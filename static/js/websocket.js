import { CardData, GameTable, Player } from "./models.js";

import { game, setGame, stateMachine } from "./game.js"
import { ViewCards } from "./view.js";

import { dragNDrop } from "./dragndrop.js";
import { manabarFilling } from "./manabarFilling.js";
import { attack } from "./attack.js";

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
function Lose() {
    const loseImage = document.getElementById('loseimg');
    const endbg = document.getElementById('endbg');
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
function Victory() {
    const winImage = document.getElementById('winimg');
    const endbg = document.getElementById('endbg');
    winImage.style.backgroundImage = "url(../static/images/field/" + heroClass + "WinGame.png)";
    winImage.style.width = "793px";
    winImage.style.height = "704px";
    winImage.style.zIndex = 9999;
    winImage.style.position = "absolute";
    winImage.style.top = "50%";
    winImage.style.left = "50%";
    winImage.style.marginRight = "-50%";
    winImage.style.transform = "translate(-50%, -50%)";
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

function startBefore() {
    const urlParams = new URLSearchParams(window.location.search);
    const heroClass = urlParams.get('heroclass');
    const selectedHeroElement = document.getElementById('selectedHero');
    selectedHeroElement.style.backgroundImage = 'url(../static/images/field/' + heroClass + '.png)';
    const selectedHeroPowerElement = document.getElementById('heropower');
    selectedHeroPowerElement.style.backgroundImage = 'url(../static/images/field/' + heroClass + 'power.png)';
    const heroHealthElement = document.getElementById('Player1HealthValue');

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
                    replacedCardIds: replacedCardIds
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
        const opponentHeroElement = document.getElementById('opponenthero');
        const opponentheroHealthElement = document.getElementById('Player2HealthValue');
        selectedHeroPowerElement.addEventListener("click", function () {
            if (selectedHeroPowerElement.style.backgroundImage == ('url("../static/images/field/' + heroClass + 'power.png")'))
                switch (heroClass) {
                    case 'Hunter':
                        opponentheroHealthElement.textContent -= 2;
                        selectedHeroPowerElement.style.backgroundImage = 'url(../static/images/field/usedpower.png)';
                        if (opponentheroHealthElement.textContent <= 0) Victory()
                        break;
                    case 'Mage':
                        selectedHeroElement.addEventListener('click', () => {
                            if (selectedHeroPowerElement.style.backgroundImage == ('url("../static/images/field/' + heroClass + 'power.png")'))
                                heroHealthElement.textContent = parseInt(heroHealthElement.textContent) - 1;
                            selectedHeroPowerElement.style.backgroundImage = 'url(../static/images/field/usedpower.png)';
                        }, { once: true });
                        opponentHeroElement.addEventListener('click', () => {
                            if (selectedHeroPowerElement.style.backgroundImage == ('url("../static/images/field/' + heroClass + 'power.png")'))
                                opponentheroHealthElement.textContent = parseInt(opponentheroHealthElement.textContent) - 1;
                            selectedHeroPowerElement.style.backgroundImage = 'url(../static/images/field/usedpower.png)';
                        }, { once: true });
                        break;
                    case 'Warlock':
                        heroHealthElement.textContent -= 2;
                        selectedHeroPowerElement.style.backgroundImage = 'url(../static/images/field/usedpower.png)';
                        // const dataToSend = {
                        //     type: "card drag",
                        //     data: {}
                        // }
                        // socket.send(JSON.stringify(dataToSend))
                        if (heroHealthElement.textContent <= 0) Lose()
                        break;
                    case 'Paladin':
                        let recruit = document.createElement('div');
                        recruit.className = "field__empty";
                        recruit.style.width = '90px';
                        recruit.style.height = '120px';
                        recruit.id = 'silver-hand-recruit';
                        recruit.style.backgroundImage = 'url(../static/images/creatures/silver-hand-recruit.png'
                        recruit.style.backgroundSize = `cover`;
                        const attackElement = document.createElement('span')
                        attackElement.className = "card__attack"
                        attackElement.textContent = '1'
                        recruit.appendChild(attackElement)
                        const hpElement = document.createElement("span")
                        hpElement.textContent = '1'
                        recruit.appendChild(hpElement)
                        const cardPlayer1 = document.getElementById('background__field');
                        cardPlayer1.appendChild(recruit);
                        selectedHeroPowerElement.style.backgroundImage = 'url(../static/images/field/usedpower.png)';
                        break;
                    case 'Priest':
                        selectedHeroElement.addEventListener('click', () => {
                            if (selectedHeroPowerElement.style.backgroundImage == ('url("../static/images/field/' + heroClass + 'power.png")'))
                                heroHealthElement.textContent = 2 + parseInt(heroHealthElement.textContent);
                            selectedHeroPowerElement.style.backgroundImage = 'url(../static/images/field/usedpower.png)';
                        }, { once: true });
                        opponentHeroElement.addEventListener('click', () => {
                            if (selectedHeroPowerElement.style.backgroundImage == ('url("../static/images/field/' + heroClass + 'power.png")'))
                                opponentheroHealthElement.textContent = 2 + parseInt(opponentheroHealthElement.textContent);
                            selectedHeroPowerElement.style.backgroundImage = 'url(../static/images/field/usedpower.png)';
                        }, { once: true });
                        break;
                }

        });
    }
}

export const socket = new WebSocket("ws://localhost:3000/ws");

export function socketInit() {
    let attackCardsLength = 0;

    socket.onmessage = function (event) {
        const endTurnButton = document.getElementById('endturn');

        const { type, data } = JSON.parse(event.data);
        setGame(ParseDataToGameTable(data));
        console.log(game.player1.hand);

        ViewCards(game.player1.cards, "background__field", "field__card")
        ViewCards(game.player1.hand, "cards", "cards__card");
        ViewCards(game.player2.cards, "background__field_opp", "field__empty_opp");

        let i = 0;

        document.querySelectorAll(".field__card").forEach(function (e) {
            i++
            if (i <= attackCardsLength)
                e.classList.add("canAttack")
        });

        switch (type) {
            case "start game":
                startBefore()
                start()
                break;
            case "exchange cards":
                afterStart()
                dragNDrop()
                attack()
                break
            case "card drag":
                dragNDrop()
                attack()
                break
            case "turn":
                dragNDrop()
                const manaElement = document.getElementById('MyMana');
                manabarFilling(10, manaElement)
                if (game.player1.turn) {
                    document.body.style.cursor = "url(../static/images/cursor/cursor.png) 10 2, auto";
                    endTurnButton.style.backgroundImage = "url(../../static/images/field/endturn1.png)";
                    endTurnButton.removeAttribute('disabled');
                    attackCardsLength = game.player1.cards.length

                    const fightCards = document.querySelectorAll(".field__card")
                    fightCards.forEach(function (e) {
                        e.classList.add("canAttack");
                    })

                    attack()

                    //socket.send("end turn")
                }
                break
            default:
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