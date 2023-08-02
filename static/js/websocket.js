import {CardData, GameTable, Player} from "./models.js";

import {game, setGame} from "./game.js"
import {ViewCards} from "./view.js";

import {dragNDrop} from "./dragndrop.js";
import {manabarFilling} from "./manabar-filling.js";
import {attack} from "./attack.js";

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
    loseImage.style.backgroundImage = "url(../static/images/field/" + heroClass + "-lose-game.png)";
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
    winImage.style.backgroundImage = "url(../static/images/field/" + heroClass + "-win-game.png)";
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
    selectedHeroPowerElement.style.backgroundImage = 'url(../static/images/field/' + heroClass + '-power.png)';
    const heroHealthElement = document.getElementById('Player1HealthValue');

    const hand = document.querySelector('.hand-and-manabar__hand')
    hand.classList.add('hand-and-manabar__hand_start')

    const handCards = document.querySelector('.hand__cards')
    handCards.classList.add('hand__cards_start')

    const cardsHeader = document.createElement('p')
    cardsHeader.className = 'cards__header'
    cardsHeader.textContent = 'Start hand'
    handCards.prepend(cardsHeader)

    const startButton = document.createElement('button')
    startButton.className = 'cards__submit'
    startButton.id = 'StartSubmit'
    startButton.textContent = 'OK'
    handCards.appendChild(startButton)

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
        selectedHeroPowerElement.style.backgroundImage = 'url(../static/images/field/' + heroClass + '-power.png)';
        const heroHealthElement = document.getElementById('Player1HealthValue');
        const opponentHeroElement = document.getElementById('opponenthero');
        const opponentheroHealthElement = document.getElementById('Player2HealthValue');
        selectedHeroPowerElement.addEventListener("click", function () {
            if (selectedHeroPowerElement.style.backgroundImage == ('url("../static/images/field/' + heroClass + '-power.png")'))
                switch (heroClass) {
                    case 'Hunter':
                        opponentheroHealthElement.textContent -= 2;
                        selectedHeroPowerElement.style.backgroundImage = 'url(../static/images/field/used-power.png)';
                        if (opponentheroHealthElement.textContent <= 0) Victory()
                        break;
                    case 'Mage':
                        selectedHeroElement.addEventListener('click', () => {
                            if (selectedHeroPowerElement.style.backgroundImage == ('url("../static/images/field/' + heroClass + '-power.png")'))
                                heroHealthElement.textContent = parseInt(heroHealthElement.textContent) - 1;
                            selectedHeroPowerElement.style.backgroundImage = 'url(../static/images/field/used-power.png)';
                        }, {once: true});
                        opponentHeroElement.addEventListener('click', () => {
                            if (selectedHeroPowerElement.style.backgroundImage == ('url("../static/images/field/' + heroClass + '-power.png")'))
                                opponentheroHealthElement.textContent = parseInt(opponentheroHealthElement.textContent) - 1;
                            selectedHeroPowerElement.style.backgroundImage = 'url(../static/images/field/used-power.png)';
                        }, {once: true});
                        break;
                    case 'Warlock':
                        heroHealthElement.textContent -= 2;
                        selectedHeroPowerElement.style.backgroundImage = 'url(../static/images/field/used-power.png)';
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
                        selectedHeroPowerElement.style.backgroundImage = 'url(../static/images/field/used-power.png)';
                        break;
                    case 'Priest':
                        selectedHeroElement.addEventListener('click', () => {
                            if (selectedHeroPowerElement.style.backgroundImage == ('url("../static/images/field/' + heroClass + '-power.png")'))
                                heroHealthElement.textContent = 2 + parseInt(heroHealthElement.textContent);
                            selectedHeroPowerElement.style.backgroundImage = 'url(../static/images/field/used-power.png)';
                        }, {once: true});
                        opponentHeroElement.addEventListener('click', () => {
                            if (selectedHeroPowerElement.style.backgroundImage == ('url("../static/images/field/' + heroClass + '-power.png")'))
                                opponentheroHealthElement.textContent = 2 + parseInt(opponentheroHealthElement.textContent);
                            selectedHeroPowerElement.style.backgroundImage = 'url(../static/images/field/used-power.png)';
                        }, {once: true});
                        break;
                }

        });
    }
}

let url = new URL(window.location.href)
var room = url.searchParams.get("room")

if (room === "" || room === null) {
    // room = localStorage.getItem("room")
    room = "default"
} else {
    console.log(room)
    // localStorage.setItem("room", room)
}
let clientId = localStorage.getItem('id')
if (clientId == undefined || clientId == null) {
    clientId = 0
}

export const socket = new WebSocket(`wss://` + window.location.hostname + `/ws?room=${room}&clientID=${clientId}`);

//export const socket = new WebSocket(`ws://localhost:3000/ws?room=${room}&clientID=${clientId}`);

export function socketInit() {
    let attackCardsLength = 0;
    socket.onmessage = function (event) {
        const endTurnButton = document.getElementById('endturn');

        const {type, data} = JSON.parse(event.data);
        setGame(ParseDataToGameTable(data));
        console.log(game)
        if (clientId === game.player1.name) {
            console.log("clientId === game.player1.name", clientId, clientId === game.player1.name)
            if (game.player1.turn) {
                console.log(clientId, "зашел в if")
                console.log("turn", game.player1.turn, "!turn", game.player2.turn)
                document.body.style.cursor = "url(../static/images/cursor/cursor.png) 10 2, auto";
                endTurnButton.style.backgroundImage = "url(../static/images/field/end-turn1.png)";
            } else {
                console.log(clientId, "зашел в else")
                console.log("turn", game.player1.turn, "!turn", game.player2.turn)
                document.body.style.cursor = "url(../static/images/cursor/spectate.png) 10 2, auto";
                endTurnButton.style.backgroundImage = "url(../static/images/field/enemy-turn.png)";
                endTurnButton.setAttribute('disabled', '');
            }
            ViewCards(game.player1.cards, "background__field", "field__card")
            ViewCards(game.player1.hand, "cards", "cards__card");
            ViewCards(game.player2.cards, "background__field_opp", "field__empty_opp");
        } else {
            console.log("clientId === game.player1.name", clientId, clientId === game.player1.name)
            if (game.player2.turn) {
                console.log(clientId, "зашел в if")
                console.log("turn", game.player1.turn, "!turn", game.player2.turn)
                endTurnButton.addEventListener("click", function () {
                    document.body.style.cursor = "url(../static/images/cursor/cursor.png) 10 2, auto";
                    endTurnButton.style.backgroundImage = "url(../static/images/field/end-turn1.png)";
                })
            } else {
                console.log(clientId, "зашел в else")
                console.log("turn", game.player1.turn, "!turn", game.player2.turn)
                document.body.style.cursor = "url(../static/images/cursor/spectate.png) 10 2, auto";
                endTurnButton.style.backgroundImage = "url(../static/images/field/enemy-turn.png)";
                endTurnButton.setAttribute('disabled', '');
            }
            ViewCards(game.player2.cards, "background__field", "field__card")
            ViewCards(game.player2.hand, "cards", "cards__card");
            ViewCards(game.player1.cards, "background__field_opp", "field__empty_opp");
        }

        let i = 0;

        document.querySelectorAll(".field__card").forEach(function (e) {
            i++
            if ((i <= attackCardsLength)) {
                e.classList.add("canAttack")
            }
            if (e.getAttribute("data-specification") === "charge") {
                e.classList.add("canAttack")
            }
        });

        switch (type) {
            case "start game":
                startBefore()
                start()
                break;
            case "exchange cards":
                afterStart()
                if (game.player1.turn && clientId === game.player1.name) {
                    dragNDrop()
                    attack()
                }
                if (game.player2.turn && clientId === game.player2.name) {
                    dragNDrop()
                    attack()
                }
                break
            case "card drag":
                if (game.player1.turn && clientId === game.player1.name) {
                    dragNDrop()
                    attack()
                }
                if (game.player2.turn && clientId === game.player2.name) {
                    dragNDrop()
                    attack()
                }
                break
            case "turn":
                if (game.player1.turn && clientId === game.player1.name) {
                    dragNDrop()
                }
                if (game.player2.turn && clientId === game.player2.name) {
                    dragNDrop()
                }
                const manaElement = document.getElementById('MyMana');
                manabarFilling(10, manaElement)
                if (game.player1.turn && clientId === game.player1.name) {
                    document.body.style.cursor = "url(../static/images/cursor/cursor.png) 10 2, auto";
                    endTurnButton.style.backgroundImage = "url(../../static/images/field/end-turn1.png)";
                    endTurnButton.removeAttribute('disabled');
                    endTurnButton.style.animation = "none";
                    endTurnButton.style.removeProperty("backgroundColor");
                    attackCardsLength = game.player1.cards.length;

                    const fightCards = document.querySelectorAll(".field__card")
                    fightCards.forEach(function (e) {
                        e.classList.add("canAttack");
                    })
                    if (game.player1.turn && clientId === game.player1.name) {
                        attack()
                    }
                    if (game.player2.turn && clientId === game.player2.name) {
                        dragNDrop()
                    }
                }
                if (game.player2.turn && clientId === game.player2.name) {
                    document.body.style.cursor = "url(../static/images/cursor/cursor.png) 10 2, auto";
                    endTurnButton.style.backgroundImage = "url(../../static/images/field/end-turn1.png)";
                    endTurnButton.removeAttribute('disabled');
                    endTurnButton.style.animation = "none";
                    endTurnButton.style.removeProperty("backgroundColor");
                    attackCardsLength = game.player1.cards.length;

                    const fightCards = document.querySelectorAll(".field__card")
                    fightCards.forEach(function (e) {
                        e.classList.add("canAttack");
                    })
                    if (game.player1.turn && clientId === game.player1.name) {
                        attack()
                    }
                    if (game.player2.turn && clientId === game.player2.name) {
                        dragNDrop()
                    }
                }
                break
            case "take a game":
                if (game.player1.turn && clientId === game.player1.name) {
                    dragNDrop()
                    attack()
                }
                if (game.player2.turn && clientId === game.player2.name) {
                    dragNDrop()
                    attack()
                }
                console.log(type, game)
                break
            case "attack":
                if (game.player1.turn && clientId === game.player1.name) {
                    dragNDrop()
                    attack()
                }
                if (game.player2.turn && clientId === game.player2.name) {
                    dragNDrop()
                    attack()
                }
                break
            default:
                console.log("undefined type", type)
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

export function ParseDataToGameTable(data) {
    return new GameTable(
        ParseDataToPlayer(data.Player1),
        ParseDataToPlayer(data.Player2),
        ParseDataToCards(data.History),
        data.Id,
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