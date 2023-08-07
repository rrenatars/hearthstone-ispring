import {CardData, GameTable, Player} from "./models.js";

import {game, setGame} from "./game.js"
import {ViewCards} from "./view.js";

import { lose } from "./end-game.js"
import { victory } from "./end-game.js"

import {dragNDrop} from "./dragndrop.js";
import {manabarFilling} from "./manabar-filling.js";
import {attack} from "./attack.js";

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

export const socket = new WebSocket(`ws://` + window.location.hostname + `:3000/ws?room=${room}&clientID=${clientId}`);


function selectCardsToExchange() {
    const cardsStart = document.querySelectorAll('.cards__card_start');
    console.log("зашел в функцию select cards")

    Array.from(cardsStart).forEach(function (card) {
        let img = null; // Флаг для отслеживания состояния элемента img
        card.addEventListener('click', function () {
            if (card.classList.contains('cards__card_swap')) {
                card.classList.remove('cards__card_swap');
                if (img) {
                    console.log("card remove img", card, "img", img)
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
    console.log("вышел из функции select cards")
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
            console.log("нажали на start submit")
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
            console.log("отправили дату")
            socket.send(JSON.stringify(dataToSend))
        })
    }
}

let paladinAbID = 1
let warlockAbID = 2
let hunterAbID  = 3
let mageAbID    = 4

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
                    case 'hunter':
                        opponentheroHealthElement.textContent -= 2;
                        selectedHeroPowerElement.style.backgroundImage = 'url(../static/images/field/used-power.png)';
                        if (opponentheroHealthElement.textContent <= 0) victory()
                        socket.send(JSON.stringify({
                            type: "ability",
                            data : {
                                PlyaerId : localStorage.getItem("id"),
                                AbilityID : hunterAbID,
                                AdditionalInformation : {
                                    Type: "",
                                    IdDefense : "",
                                }
                            }
                        }))
                        break;
                    case 'mage':
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
                        socket.send(JSON.stringify({
                            type: "ability",
                            data : {
                                PlyaerId : localStorage.getItem("id"),
                                AbilityID : mageAbID,
                                AdditionalInformation : {
                                    Type: "",
                                    IdDefense : "",
                                }
                            }
                        }))
                        break;
                    case 'warlock':
                        heroHealthElement.textContent -= 2;
                        selectedHeroPowerElement.style.backgroundImage = 'url(../static/images/field/used-power.png)';
                        // const dataToSend = {
                        //     type: "card drag",
                        //     data: {}
                        // }
                        // socket.send(JSON.stringify(dataToSend))
                        if (heroHealthElement.textContent <= 0) Lose()
                        socket.send(JSON.stringify({
                            type: "ability",
                            data : {
                                PlyaerId : localStorage.getItem("id"),
                                AbilityID : warlockAbID,
                                AdditionalInformation : {
                                    Type: "",
                                    IdDefense : "",
                                }
                            }
                        }))
                        break;
                    case 'paladin':
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
                        if (heroHealthElement.textContent <= 0) Lose()
                        socket.send(JSON.stringify({
                            type: "ability",
                            data : {
                                PlyaerId : localStorage.getItem("id"),
                                AbilityID : paladinAbID,
                                AdditionalInformation : {
                                    Type: "",
                                    IdDefense : "",
                                }
                            }
                        }))
                        break;
                }

        });
    }
}

//export const socket = new WebSocket(`ws://localhost:3000/ws?room=${room}&clientID=${clientId}`);


function HandleGame(data, myHeroHealthValue, enemyHeroHealthValue, endTurnButton) {
    setGame(ParseDataToGameTable(data));
    console.log(game)
    if (clientId === game.player1.name) {
        if (game.player1.CounterOfMoves > 0) {
            if (game.player1.turn) {
                document.body.style.cursor = "url(../static/images/cursor/cursor.png) 10 2, auto";
                endTurnButton.style.backgroundImage = "url(../static/images/field/end-turn1.png)";
            } else {
                document.body.style.cursor = "url(../static/images/cursor/spectate.png) 10 2, auto";
                endTurnButton.style.backgroundImage = "url(../static/images/field/enemy-turn.png)";
                endTurnButton.setAttribute('disabled', '');
            }
        }
        ViewCards(game.player1.cards, "background__field", "field__card")
        ViewCards(game.player1.hand, "cards", "cards__card");
        ViewCards(game.player2.cards, "background__field_opp", "field__empty_opp");
        myHeroHealthValue.textContent = game.player1.HP
        enemyHeroHealthValue.textContent = game.player2.HP
    } else {
        if (game.player2.CounterOfMoves > 0) {
            if (game.player2.turn) {
                endTurnButton.addEventListener("click", function () {
                    document.body.style.cursor = "url(../static/images/cursor/cursor.png) 10 2, auto";
                    endTurnButton.style.backgroundImage = "url(../static/images/field/end-turn1.png)";
                })
            } else {
                document.body.style.cursor = "url(../static/images/cursor/spectate.png) 10 2, auto";
                endTurnButton.style.backgroundImage = "url(../static/images/field/enemy-turn.png)";
                endTurnButton.setAttribute('disabled', '');
            }
        }
        ViewCards(game.player2.cards, "background__field", "field__card")
        ViewCards(game.player2.hand, "cards", "cards__card");
        ViewCards(game.player1.cards, "background__field_opp", "field__empty_opp");
        myHeroHealthValue.textContent = game.player2.HP
        enemyHeroHealthValue.textContent = game.player1.HP
    }
}

export function socketInit() {
    let attackCardsLength = 0;
    socket.onmessage = function (event) {
        const endTurnButton = document.getElementById('endturn');

        const myHeroHealthValue = document.getElementById("Player1HealthValue")
        const enemyHeroHealthValue = document.getElementById("Player2HealthValue")

        const {type, data} = JSON.parse(event.data);
        console.log(data)
        // HandleGame(data, myHeroHealthValue, enemyHeroHealthValue, endTurnButton)

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

        const myManaElement = document.getElementById("MyMana")
        const enemyManaElement = document.getElementById("EnemyMana")

        switch (type) {
            case "start game":
                HandleGame(data, myHeroHealthValue, enemyHeroHealthValue, endTurnButton)
                // заполнение маны в самом начале игры
                if (game.player1.turn && clientId === game.player1.name) {
                    manabarFilling(game.player1.Mana, myManaElement, game.player1.CounterOfMoves);
                    manabarFilling(game.player2.Mana, enemyManaElement, game.player2.CounterOfMoves)
                }
                if (game.player2.turn && clientId === game.player2.name) {
                    manabarFilling(game.player2.Mana, myManaElement, game.player2.CounterOfMoves)
                    manabarFilling(game.player1.Mana, enemyManaElement, game.player1.CounterOfMoves)
                }
                if ((clientId === game.player1.name) && (!game.player1.turn)) {
                    if (game.player1.Mana > 1) {
                        manabarFilling(game.player1.Mana, myManaElement, game.player1.CounterOfMoves)
                    }
                    manabarFilling(game.player2.Mana, enemyManaElement, game.player2.CounterOfMoves)
                }
                if ((clientId === game.player2.name) && (!game.player2.turn)) {
                    if (game.player2.Mana > 1) {
                        manabarFilling(game.player2.Mana, myManaElement, game.player2.CounterOfMoves)
                    }
                    manabarFilling(game.player1.Mana, enemyManaElement, game.player1.CounterOfMoves)
                }
                // if ((game.player1.CounterOfMoves === 0) && (game.player2.CounterOfMoves === 0)) {
                //     startBefore()
                //     start()
                // }
                if ((clientId === game.player1.name) && (game.player1.CounterOfMoves === 0)) {
                    startBefore()
                    start()
                }
                if ((clientId === game.player2.name) && (game.player2.CounterOfMoves === 0)) {
                    startBefore()
                    start()
                }
                break;
            case "exchange cards":
                HandleGame(data, myHeroHealthValue, enemyHeroHealthValue, endTurnButton)
                // if (clientId === game.player1.name) {
                //     if (game.player1.CounterOfMoves > 0) {
                //         console.log("fjajdf", game.player1.CounterOfMoves)
                //         afterStart()
                //         ViewCards(game.player1.hand, "cards", "cards__card");
                //         if (game.player1.turn) {
                //             manabarFilling(game.player1.Mana, myManaElement, game.player1.CounterOfMoves);
                //             manabarFilling(game.player2.Mana, enemyManaElement, game.player2.CounterOfMoves)
                //             dragNDrop()
                //             attack()
                //         }
                //     } else {
                //         const startSubmit = document.getElementById("StartSubmit")
                //         console.log("else")
                //         if (!startSubmit) {
                //             console.log("else2")
                //             startBefore()
                //             start()
                //         }
                //     }
                // }
                // if (clientId === game.player2.name) {
                //     if (game.player2.CounterOfMoves > 0) {
                //         console.log("fjajdf", game.player2.CounterOfMoves)
                //         afterStart()
                //         ViewCards(game.player2.hand, "cards", "cards__card");
                //         if (game.player2.turn) {
                //             manabarFilling(game.player2.Mana, myManaElement, game.player2.CounterOfMoves)
                //             manabarFilling(game.player1.Mana, enemyManaElement, game.player1.CounterOfMoves)
                //             dragNDrop()
                //             attack()
                //         }
                //     } else {
                //         const startSubmit = document.getElementById("StartSubmit")
                //         console.log("else")
                //         if (!startSubmit) {
                //             console.log("else2")
                //             startBefore()
                //             start()
                //         }
                //     }
                // }
                console.log("карты сразу после того как зашли в exchange cards", document.querySelectorAll(".cards__card"))
                if (clientId === game.player1.name) {
                    if (game.player1.turn && game.player1.CounterOfMoves > 0) {
                        afterStart()
                        console.log("зашел после after start")
                        manabarFilling(game.player1.Mana, myManaElement, game.player1.CounterOfMoves);
                        manabarFilling(game.player2.Mana, enemyManaElement, game.player2.CounterOfMoves)
                        dragNDrop()
                        attack()
                    } else {
                        console.log("зашел в else start", document.getElementById("StartSubmit"))
                        if (document.getElementById("StartSubmit")) {
                            console.log("зашел в if с cards start")
                            const hand = document.querySelector('.hand-and-manabar__hand');

                            const startSubmit = document.getElementById('StartSubmit');
                            const cardsHeader = document.querySelector('.cards__header');
                            const handCards = document.querySelector('.hand__cards_start');

                            hand.classList.remove('hand-and-manabar__hand_start');

                            handCards.removeChild(startSubmit);
                            handCards.removeChild(cardsHeader);
                            handCards.classList.remove('hand__cards_start');

                            startBefore()
                            start()
                        }
                    }
                }
                if (clientId === game.player2.name) {
                    if (game.player2.CounterOfMoves > 0 && game.player2.turn) {
                        afterStart()
                        console.log("зашел после after start")
                        manabarFilling(game.player2.Mana, myManaElement, game.player2.CounterOfMoves)
                        manabarFilling(game.player1.Mana, enemyManaElement, game.player1.CounterOfMoves)
                        dragNDrop()
                        attack()
                    } else {
                        console.log("зашел в else start", document.getElementById("StartSubmit"))
                        if (document.getElementById("StartSubmit")) {
                            console.log("зашел в if с cards start")
                            const hand = document.querySelector('.hand-and-manabar__hand');

                            const startSubmit = document.getElementById('StartSubmit');
                            const cardsHeader = document.querySelector('.cards__header');
                            const cards = document.querySelectorAll('.cards__card_start');
                            const handCards = document.querySelector('.hand__cards_start');

                            hand.classList.remove('hand-and-manabar__hand_start');

                            handCards.removeChild(startSubmit);
                            handCards.removeChild(cardsHeader);
                            handCards.classList.remove('hand__cards_start');

                            startBefore()
                            start()
                        }
                    }
                }

                // чтобы при ходе оппонента заполнилась его мана
                if (clientId === game.player1.name && game.player1.CounterOfMoves > 0) {
                    manabarFilling(game.player2.Mana, enemyManaElement, game.player2.CounterOfMoves)
                }
                if (clientId === game.player2.name && game.player2.CounterOfMoves > 0) {
                    manabarFilling(game.player1.Mana, enemyManaElement, game.player1.CounterOfMoves)
                }
                break
            case "card drag":
                HandleGame(data, myHeroHealthValue, enemyHeroHealthValue, endTurnButton)
                // заполнение маны после перетаскивания карты
                if (game.player1.turn && clientId === game.player1.name) {
                    dragNDrop()
                    attack()
                    manabarFilling(game.player1.Mana, myManaElement, game.player1.CounterOfMoves)
                }
                if (game.player2.turn && clientId === game.player2.name) {
                    dragNDrop()
                    attack()
                    manabarFilling(game.player2.Mana, myManaElement, game.player2.CounterOfMoves)
                }
                // чтобы мана оппонента обновлялась при его ходах
                if ((clientId === game.player1.name) && (!game.player1.turn)) {
                    manabarFilling(game.player2.Mana, enemyManaElement, game.player2.CounterOfMoves)
                }
                if ((clientId === game.player2.name) && (!game.player2.turn)) {
                    manabarFilling(game.player1.Mana, enemyManaElement, game.player1.CounterOfMoves)
                }
                break
            case "turn":
                HandleGame(data, myHeroHealthValue, enemyHeroHealthValue, endTurnButton)
                // чтобы мана оппонента не обновлялась при передаче хода, то есть была видна мана до нажатия кнопки завершить ход оппонента
                if (game.player1.turn && clientId === game.player1.name) {
                    manabarFilling(game.player1.Mana, myManaElement, game.player1.CounterOfMoves)
                    dragNDrop()
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
                    attack()
                }
                if (game.player2.turn && clientId === game.player2.name) {
                    manabarFilling(game.player2.Mana, myManaElement, game.player2.CounterOfMoves)
                    dragNDrop()
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
                    attack()
                }
                // чтобы при передаче хода оппоненту заполнялась мана оппонента
                if ((clientId === game.player1.name) && (!game.player1.turn)) {
                    manabarFilling(game.player2.Mana, enemyManaElement, game.player2.CounterOfMoves)
                }
                if ((clientId === game.player2.name) && (!game.player2.turn)) {
                    manabarFilling(game.player1.Mana, enemyManaElement, game.player1.CounterOfMoves)
                }
                break
            case "take a game":
                HandleGame(data, myHeroHealthValue, enemyHeroHealthValue, endTurnButton)
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
                HandleGame(data, myHeroHealthValue, enemyHeroHealthValue, endTurnButton)
                if (game.player1.turn && clientId === game.player1.name) {
                    dragNDrop()
                    attack()
                }
                if (game.player2.turn && clientId === game.player2.name) {
                    dragNDrop()
                    attack()
                }
                break
            case "bot attack":
                HandleGame(data.Game, myHeroHealthValue, enemyHeroHealthValue, endTurnButton)
                console.log("bot attack")
                dragNDrop()
                attack()
                break
            case "bot win":
                console.log("$$$$$$$$$$$$$$$$$$$$$bot win$$$$$$$$$$$$$$$$$$$$$$")
                lose()
                socket.send(JSON.stringify({
                    type: "defeat",
                    data : {
                        clientID: localStorage.getItem('id')
                    }
                }))
                break
            case "ability":
                HandleGame(data.Game, myHeroHealthValue, enemyHeroHealthValue, endTurnButton)
                console.log("ability")
                dragNDrop()
                attack()
                break
            default:
                console.log("undefined type", type)
                break
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
        data.Mana,
        data.CounterOfMoves,
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
    if (data == null) {
        return [CardData]
    }
    for (const card of data) {
        newCards.push(ParseDataToCard(card));
    }
    return newCards;
}