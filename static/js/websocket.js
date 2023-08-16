import {CardData, GameTable, Player} from "./models.js";

import {game, setGame} from "./game.js"
import {ViewCards} from "./view.js";

import {lose, checkVictoryOrLose} from "./end-game.js"

import {dragNDrop} from "./dragndrop.js";
import {manabarFilling} from "./manabar-filling.js";
import {attack} from "./attack.js";

import {enableToDrag, enableToAttack} from "./enable.js";

import {yourTurn} from "./your-turn.js";
import {handMouseOver, fieldMouseOver, buttonMouseOver, abilityMouseOver} from "./hover.js";
import {greenButton} from "./green-button.js";

import {startBefore, start, afterStart} from "./start-init.js";
import {reloadHeroPower} from "./reloadHeroPower.js";

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
if (clientId === undefined || clientId === null) {
    clientId = 0
}

export const socket = new WebSocket(`wss://` + window.location.hostname + `/ws?room=${room}&clientID=${clientId}`);

const urlParams = new URLSearchParams(window.location.search);
let heroClass = urlParams.get('heroclass')

export function socketInit() {
    const selectedHeroElement = document.getElementById('selectedHero');
    const selectedHeroPowerElement = document.getElementById('heropower');
    const opponentHeroElement = document.getElementById('opponenthero');
    socket.onmessage = function (event) {
        const endTurnButton = document.getElementById('endturn');

        const myHeroHealthValue = document.getElementById("Player1HealthValue")
        const enemyHeroHealthValue = document.getElementById("Player2HealthValue")

        const {type, data} = JSON.parse(event.data);
        setGame(ParseDataToGameTable(data));
        checkVictoryOrLose(game, clientId)
        console.log(game)

        // if (game.player1.name === clientId) {
        //     selectedHeroElement.style.backgroundImage = 'url(../static/images/field/' + game.player1.hero + '.png)';
        //     if ((!game.player1.heroTurn)) {
        //         selectedHeroPowerElement.style.backgroundImage = 'url(../static/images/field/' + game.player1.hero + '-power.png)';
        //         heroPowerEnableToAttack(game.player1.Mana, selectedHeroPowerElement)
        //     } else {
        //         selectedHeroPowerElement.style.backgroundImage = 'url(../static/images/field/used-power.png)';
        //         selectedHeroPowerElement.classList.remove("cards__card_enable-to-drag")
        //     }
        //     opponentHeroElement.style.backgroundImage = 'url(../static/images/field/' + game.player2.hero + '.png)'
        // } else {
        //     selectedHeroElement.style.backgroundImage = 'url(../static/images/field/' + game.player2.hero + '.png)';
        //     if (!game.player2.heroTurn) {
        //         selectedHeroPowerElement.style.backgroundImage = 'url(../static/images/field/' + game.player2.hero + '-power.png)';
        //         heroPowerEnableToAttack(game.player2.Mana, selectedHeroPowerElement)
        //     } else {
        //         selectedHeroPowerElement.style.backgroundImage = 'url(../static/images/field/used-power.png)';
        //         selectedHeroPowerElement.classList.remove("cards__card_enable-to-drag")
        //     }
        //     opponentHeroElement.style.backgroundImage = 'url(../static/images/field/' + game.player1.hero + '.png)'
        // }

        if (clientId === game.player1.name) {
            ViewCards(game.player1.cards, "background__field", "field__card")
            if (game.player1.cards.length === 0) {
                while (document.getElementById("background__field").firstChild) {
                    document.getElementById("background__field").removeChild(document.getElementById("background__field").firstChild)
                }
                let emptyField = document.createElement("div")
                emptyField.classList.add("field__empty")
                document.getElementById("background__field").append(emptyField)
            }
            ViewCards(game.player1.hand, "cards", "cards__card");
            ViewCards(game.player2.cards, "background__field_opp", "field__card_opp");
            if (game.player2.cards.length === 0) {
                while (document.getElementById("background__field_opp").firstChild) {
                    document.getElementById("background__field_opp").removeChild(document.getElementById("background__field_opp").firstChild)
                }
                let emptyField = document.createElement("div")
                emptyField.classList.add("field__empty_opp")
                document.getElementById("background__field_opp").append(emptyField)
            }

            myHeroHealthValue.textContent = game.player1.HP
            enemyHeroHealthValue.textContent = game.player2.HP

            const myCreatures = document.querySelectorAll(".field__card")
            const enemyCreatures = document.querySelectorAll(".field__card_opp")

            if (game.player1.CounterOfMoves > 0) {
                fieldMouseOver(Array.from(myCreatures).concat(Array.from(enemyCreatures)))
                if (game.player1.turn) {
                    document.body.style.cursor = "url(../static/images/cursor/cursor.png) 10 2, auto";
                    endTurnButton.style.backgroundImage = "url(../static/images/field/end-turn1.png)";
                    enableToDrag(game.player1.Mana)
                    reloadHeroPower(game.player1, game.player2)
                    const cards = document.querySelectorAll(".cards__card")
                    handMouseOver(game, cards, clientId)
                    abilityMouseOver(game, document.getElementById("heropower"), clientId)
                    buttonMouseOver(document.querySelector(".endturn-button"))
                    dragNDrop()
                    enableToAttack(game.player1.cardsToAttack)
                    attack()
                    greenButton()
                } else {
                    document.body.style.cursor = "url(../static/images/cursor/spectate.png) 10 2, auto";
                    endTurnButton.style.backgroundImage = "url(../static/images/field/enemy-turn.png)";
                    endTurnButton.setAttribute('disabled', '');
                }
            }
        }

        if (clientId === game.player2.name) {
            ViewCards(game.player2.cards, "background__field", "field__card")
            if (game.player2.cards.length === 0) {
                while (document.getElementById("background__field").firstChild) {
                    document.getElementById("background__field").removeChild(document.getElementById("background__field").firstChild)
                }
                let emptyField = document.createElement("div")
                emptyField.classList.add("field__empty")
                document.getElementById("background__field").append(emptyField)
            }
            ViewCards(game.player2.hand, "cards", "cards__card");
            ViewCards(game.player1.cards, "background__field_opp", "field__card_opp");
            if (game.player1.cards.length === 0) {
                while (document.getElementById("background__field_opp").firstChild) {
                    document.getElementById("background__field_opp").removeChild(document.getElementById("background__field_opp").firstChild)
                }
                let emptyField = document.createElement("div")
                emptyField.classList.add("field__empty_opp")
                document.getElementById("background__field_opp").append(emptyField)
            }

            myHeroHealthValue.textContent = game.player2.HP
            enemyHeroHealthValue.textContent = game.player1.HP

            const myCreatures = document.querySelectorAll(".field__card")
            const enemyCreatures = document.querySelectorAll(".field__card_opp")

            if (game.player2.CounterOfMoves > 0) {
                fieldMouseOver(Array.from(myCreatures).concat(Array.from(enemyCreatures)))
                if (game.player2.turn) {
                    endTurnButton.addEventListener("click", function () {
                        document.body.style.cursor = "url(../static/images/cursor/cursor.png) 10 2, auto";
                        endTurnButton.style.backgroundImage = "url(../static/images/field/end-turn1.png)";
                    })
                    enableToDrag(game.player2.Mana)
                    reloadHeroPower(game.player2, game.player1)
                    const cards = document.querySelectorAll(".cards__card")
                    handMouseOver(game, cards, clientId)
                    abilityMouseOver(game, document.getElementById("heropower"), clientId)
                    buttonMouseOver(document.querySelector(".endturn-button"))
                    dragNDrop()
                    enableToAttack(game.player2.cardsToAttack)
                    attack()
                    greenButton()
                } else {
                    document.body.style.cursor = "url(../static/images/cursor/spectate.png) 10 2, auto";
                    endTurnButton.style.backgroundImage = "url(../static/images/field/enemy-turn.png)";
                    endTurnButton.setAttribute('disabled', '');
                }
            }
        }

        const myManaElement = document.getElementById("MyMana")
        const enemyManaElement = document.getElementById("EnemyMana")
        console.log("type", type)

        switch (type) {
            case "start game":
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
                if (clientId === game.player1.name) {
                    if (game.player1.turn && game.player1.CounterOfMoves > 0) {
                        afterStart()
                        manabarFilling(game.player1.Mana, myManaElement, game.player1.CounterOfMoves);
                        manabarFilling(game.player2.Mana, enemyManaElement, game.player2.CounterOfMoves)
                    } else {
                        if (document.getElementById("StartSubmit")) {
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
                        manabarFilling(game.player2.Mana, myManaElement, game.player2.CounterOfMoves)
                        manabarFilling(game.player1.Mana, enemyManaElement, game.player1.CounterOfMoves)
                    } else {
                        if (document.getElementById("StartSubmit")) {
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

                // чтобы при ходе оппонента заполнилась его мана
                if (clientId === game.player1.name && game.player1.CounterOfMoves > 0) {
                    manabarFilling(game.player2.Mana, enemyManaElement, game.player2.CounterOfMoves)
                }
                if (clientId === game.player2.name && game.player2.CounterOfMoves > 0) {
                    manabarFilling(game.player1.Mana, enemyManaElement, game.player1.CounterOfMoves)
                }
                break
            case "card drag":
                // заполнение маны после перетаскивания карты
                if (game.player1.turn && clientId === game.player1.name) {
                    attack()
                    manabarFilling(game.player1.Mana, myManaElement, game.player1.CounterOfMoves)
                }
                if (game.player2.turn && clientId === game.player2.name) {
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
                // чтобы мана оппонента не обновлялась при передаче хода, то есть была видна мана до нажатия кнопки завершить ход оппонента
                if (game.player1.turn && clientId === game.player1.name) {
                    manabarFilling(game.player1.Mana, myManaElement, game.player1.CounterOfMoves)
                    if (game.player1.HP > 0) {
                        yourTurn()
                    }
                    document.body.style.cursor = "url(../static/images/cursor/cursor.png) 10 2, auto";
                    endTurnButton.style.backgroundImage = "url(../../static/images/field/end-turn1.png)";
                    endTurnButton.removeAttribute('disabled');
                    endTurnButton.style.removeProperty("animation")
                    endTurnButton.style.removeProperty("backgroundColor");

                    attack()
                }
                if (game.player2.turn && clientId === game.player2.name) {
                    manabarFilling(game.player2.Mana, myManaElement, game.player2.CounterOfMoves)
                    if (game.player2.HP > 0) {
                        yourTurn()
                    }
                    document.body.style.cursor = "url(../static/images/cursor/cursor.png) 10 2, auto";
                    endTurnButton.style.backgroundImage = "url(../../static/images/field/end-turn1.png)";
                    endTurnButton.removeAttribute('disabled');
                    endTurnButton.style.removeProperty("animation")
                    endTurnButton.style.removeProperty("backgroundColor");

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
                if (game.player1.turn && clientId === game.player1.name) {
                    attack()
                }
                if (game.player2.turn && clientId === game.player2.name) {
                    attack()
                }
                console.log(type, game)
                break
            case "attack":
                break
            case "bot attack":
                console.log("bot attack")
                attack()
                break
            case "bot win":
                console.log("$$$$$$$$$$$$$$$$$$$$$bot win$$$$$$$$$$$$$$$$$$$$$$")
                lose()
                socket.send(JSON.stringify({
                    type: "defeat",
                    data: {
                        clientID: localStorage.getItem('id')
                    }
                }))
                break
            case "ability":
                console.log("ability")
                attack()
                // заполнение маны после перетаскивания карты
                if (game.player1.turn && clientId === game.player1.name) {
                    attack()
                    manabarFilling(game.player1.Mana, myManaElement, game.player1.CounterOfMoves)
                }
                if (game.player2.turn && clientId === game.player2.name) {
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
            default:
                console.log("undefined type", type)
                break;
        }
    };

    if (heroClass != "mage") {
        selectedHeroPowerElement.addEventListener("click", event => {
            socket.send(JSON.stringify({
                type: "ability",
                data: {
                    IdDefense: "",
                    PlyaerId: clientId,
                }
            }))
        });
    }

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
        data.Hero,
        data.HeroTurn,
        ParseDataToCards(data.CardsToAttack),
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