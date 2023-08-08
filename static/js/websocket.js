import {CardData, GameTable, Player} from "./models.js";

import {game, setGame} from "./game.js"
import {ViewCards} from "./view.js";

import { lose } from "./end-game.js"
import { victory } from "./end-game.js"

import {dragNDrop} from "./dragndrop.js";
import {manabarFilling, manabarFillingHover} from "./manabar-filling.js";
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
if (clientId === undefined || clientId === null) {
    clientId = 0
}

export const socket = new WebSocket(`wss://` + window.location.hostname + `/ws?room=${room}&clientID=${clientId}`);

function selectCardsToExchange() {
    const cardsStart = document.querySelectorAll('.cards__card_start');

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
                        img.classList.add("cross")
                        img.src = "/static/images/cross.png";
                        card.appendChild(img); // Добавляем img только если его еще нет
                    }
                }
            }
        });
    });
}

let heroClass
function startBefore() {
    const urlParams = new URLSearchParams(window.location.search);
    heroClass = urlParams.get('heroclass');
    const selectedHeroElement = document.getElementById('selectedHero');
    selectedHeroElement.style.backgroundImage = 'url(../static/images/field/' + heroClass + '.png)';
    const selectedHeroPowerElement = document.getElementById('heropower');
    selectedHeroPowerElement.style.backgroundImage = 'url(../static/images/field/' + heroClass + '-power.png)';
    const heroHealthElement = document.getElementById('Player1HealthValue');

    const hand = document.querySelector('.hand-and-manabar__hand')
    hand.classList.add('hand-and-manabar__hand_start')

    const handCards = document.querySelector('.hand__cards')
    handCards.classList.add('hand__cards_start')

    const cardsInner = document.querySelector(".cards")
    cardsInner.classList.add("cards_start")

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
    const cardsInner = document.querySelector(".cards_start")
    const handCards = document.querySelector('.hand__cards_start');
    if (startSubmit) {
        startSubmit.addEventListener('click', (evt) => {
            console.log("нажали на start submit")
            hand.classList.remove('hand-and-manabar__hand_start');

            handCards.removeChild(startSubmit);
            handCards.removeChild(cardsHeader);
            handCards.classList.remove('hand__cards_start');
            cardsInner.classList.remove("cards_start")

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
            setTimeout(function() {
                window.location.reload();
            }, 500)
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
                        // socket.send(JSON.stringify({
                        //     type: "ability",
                        //     data : {
                        //         PlyaerId : localStorage.getItem("id"),
                        //         AbilityID : hunterAbID,
                        //         AdditionalInformation : {
                        //             Type: "",
                        //             IdDefense : "",
                        //         }
                        //     }
                        // }))
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
                        // socket.send(JSON.stringify({
                        //     type: "ability",
                        //     data : {
                        //         PlyaerId : localStorage.getItem("id"),
                        //         AbilityID : mageAbID,
                        //         AdditionalInformation : {
                        //             Type: "",
                        //             IdDefense : "",
                        //         }
                        //     }
                        // }))
                        break;
                    case 'warlock':
                        heroHealthElement.textContent -= 2;
                        selectedHeroPowerElement.style.backgroundImage = 'url(../static/images/field/used-power.png)';
                        if (heroHealthElement.textContent <= 0) lose()
                        // socket.send(JSON.stringify({
                        //     type: "ability",
                        //     data : {
                        //         PlyaerId : localStorage.getItem("id"),
                        //         AbilityID : warlockAbID,
                        //         AdditionalInformation : {
                        //             Type: "",
                        //             IdDefense : "",
                        //         }
                        //     }
                        // }))
                        break;
                    case 'paladin':
                        selectedHeroPowerElement.style.backgroundImage = 'url(../static/images/field/used-power.png)';
                        // socket.send(JSON.stringify({
                        //     type: "ability",
                        //     data : {
                        //         PlyaerId : localStorage.getItem("id"),
                        //         AbilityID : paladinAbID,
                        //         AdditionalInformation : {
                        //             Type: "",
                        //             IdDefense : "",
                        //         }
                        //     }
                        // }))
                        break;
                }

        });
    }
}

const beforeStyleAnim = document.createElement("style");
document.head.appendChild(beforeStyleAnim);

function animateCards(b, s) {
    beforeStyleAnim.innerHTML = `.cards__card_enable-to-drag::before {` +
        `filter: brightness(1) sepia(1) hue-rotate(60deg) saturate(` + s +`) blur(` + b + `px);
    }`;

    setTimeout(function() {
        if (b === 9) {
            animateCards(6, s);
        } else if (s === 16) {
            animateCards(b + 1, 4);
        } else {
            animateCards(b + 1, s + 1)
        }
    }, 500);
}

function yourTurn() {
    let yourTurnElement = document.createElement("img")

    yourTurnElement.classList.add("your-turn")
    yourTurnElement.src = "../../static/images/field/your-turn.png"
    document.body.append(yourTurnElement)

    setTimeout(function () {
        document.body.removeChild(document.querySelector(".your-turn"))
    }, 2000)
}

function enableToDrag(manaValue) {
    const cards = document.querySelectorAll(".cards__card")

    cards.forEach((card) => {
        if (manaValue >= parseInt(card.querySelector(".card__mana").textContent)) {
            card.classList.add("cards__card_enable-to-drag")
            const style = window.getComputedStyle(card, "::before");
            const cardPortraitUrl = card.style.backgroundImage.match(/url\(["']?([^"']+)["']?\)/)[1];
            let beforeStyle = document.createElement('style');
            beforeStyle.innerHTML = `
            .cards__card_enable-to-drag::before {
                background-image: url(` + cardPortraitUrl + `);
            }
            `;
            // Добавляем созданный стиль в голову документа
            document.head.appendChild(beforeStyle);

            const innerE = document.createElement("div")
            innerE.style.backgroundImage = "url(" + cardPortraitUrl + ")"
            innerE.style.backgroundSize = "cover"
            innerE.classList.add("cards__card_inner")
            card.style.backgroundImage = ''
            card.append(innerE)

            animateCards(6, 4);
        }
    })
}

function mouseOver(game, elements) {
    function handleMouseOver(event) {
        // Выводим сообщение в консоль при наведении на элемент

        let card = event.target

        if (event.target.classList.contains("cards__card_inner")) {
            card = event.target.parentElement
        }

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

        if (event.target.classList.contains("cards__card_inner")) {
            card = event.target.parentElement
        }

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

export function socketInit() {
    let attackCardsLength = 0;

    const selectedHeroElement = document.getElementById('selectedHero');
    const selectedHeroPowerElement = document.getElementById('heropower');
    const opponentHeroElement = document.getElementById('opponenthero');
    const endTurnButton = document.getElementById('endturn');
    socket.onmessage = function (event) {
        const endTurnButton = document.getElementById('endturn');

        const myHeroHealthValue = document.getElementById("Player1HealthValue")
        const enemyHeroHealthValue = document.getElementById("Player2HealthValue")

        const {type, data} = JSON.parse(event.data);
        setGame(ParseDataToGameTable(data));
        checkVictoryOrLoose(game)
        console.log(game)

        if (game.player1.name === clientId) {
            selectedHeroElement.style.backgroundImage = 'url(../static/images/field/' + game.player1.hero + '.png)';
            if (!game.player1.heroTurn) {
                selectedHeroPowerElement.style.backgroundImage = 'url(../static/images/field/' + game.player1.hero + '-power.png)';
            } else {
                selectedHeroPowerElement.style.backgroundImage = 'url(../static/images/field/used-power.png)';
            }
            opponentHeroElement.style.backgroundImage = 'url(../static/images/field/' + game.player2.hero + '.png)'
        } else {
            selectedHeroElement.style.backgroundImage = 'url(../static/images/field/' + game.player2.hero + '.png)';
            if (!game.player2.heroTurn) {
                selectedHeroPowerElement.style.backgroundImage = 'url(../static/images/field/' + game.player2.hero + '-power.png)';
            } else {
                selectedHeroPowerElement.style.backgroundImage = 'url(../static/images/field/used-power.png)';
            }
            opponentHeroElement.style.backgroundImage = 'url(../static/images/field/' + game.player1.hero + '.png)'
        }

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
            if (game.player1.cards.length === 0) {
                while (document.getElementById("background__field").firstChild)  {
                    document.getElementById("background__field").removeChild(document.getElementById("background__field").firstChild)
                }
                let emptyField = document.createElement("div")
                emptyField.classList.add("field__empty_opp")
                document.getElementById("background__field").append(emptyField)
            }
            ViewCards(game.player1.hand, "cards", "cards__card");
            ViewCards(game.player2.cards, "background__field_opp", "field__empty_opp");
            if (game.player2.cards.length === 0) {
                while (document.getElementById("background__field_opp").firstChild)  {
                    document.getElementById("background__field_opp").removeChild(document.getElementById("background__field_opp").firstChild)
                }
                let emptyField = document.createElement("div")
                emptyField.classList.add("field__empty_opp")
                document.getElementById("background__field_opp").append(emptyField)
            }
            myHeroHealthValue.textContent = game.player1.HP
            enemyHeroHealthValue.textContent = game.player2.HP
        }
        if (clientId === game.player2.name) {
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
            if (game.player2.cards.length === 0) {
                while (document.getElementById("background__field").firstChild)  {
                    document.getElementById("background__field").removeChild(document.getElementById("background__field").firstChild)
                }
                let emptyField = document.createElement("div")
                emptyField.classList.add("field__empty_opp")
                document.getElementById("background__field").append(emptyField)
            }
            ViewCards(game.player2.hand, "cards", "cards__card");
            ViewCards(game.player1.cards, "background__field_opp", "field__empty_opp");
            if (game.player1.cards.length === 0) {
                while (document.getElementById("background__field_opp").firstChild)  {
                    document.getElementById("background__field_opp").removeChild(document.getElementById("background__field_opp").firstChild)
                }
                let emptyField = document.createElement("div")
                emptyField.classList.add("field__empty_opp")
                document.getElementById("background__field_opp").append(emptyField)
            }
            myHeroHealthValue.textContent = game.player2.HP
            enemyHeroHealthValue.textContent = game.player1.HP
        }

        let i = 0;

        console.log("attack cards length", attackCardsLength)

        document.querySelectorAll(".field__card").forEach(function (e) {
            i++
            if ((i <= attackCardsLength)) {
                e.classList.add("canAttack")
            }
            if (e.getAttribute("data-specification") === "charge") {
                e.classList.add("canAttack")
            }
        });

        if (clientId === game.player1.name && game.player1.turn && game.player1.CounterOfMoves > 0) {
            enableToDrag(game.player1.Mana)
            const cards = document.querySelectorAll(".cards__card")
            mouseOver(game, cards)
            dragNDrop()
            attack()
        }
        if (clientId === game.player2.name && game.player2.turn && game.player2.CounterOfMoves > 0) {
            enableToDrag(game.player2.Mana)
            const cards = document.querySelectorAll(".cards__card")
            mouseOver(game, cards)
            dragNDrop()
            attack()
        }

        const myManaElement = document.getElementById("MyMana")
        const enemyManaElement = document.getElementById("EnemyMana")
        console.log("type", type)

        let cardsNumber = i

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
                        const cards = document.querySelectorAll(".cards__card")
                        mouseOver(game, cards)
                        yourTurn()
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
                        const cards = document.querySelectorAll(".cards__card")
                        mouseOver(game, cards)
                        yourTurn()
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
                // заполнение маны после перетаскивания карты
                if (game.player1.turn && clientId === game.player1.name) {
                    const cards = document.querySelectorAll(".cards__card")
                    mouseOver(game, cards)
                    if (cardsNumber <= 7) {
                        dragNDrop()
                    }
                    else {
                        const comment = document.getElementById("comment");
                        const commentText = document.getElementById("commentText");
                        commentText.innerText = "У меня слишком\nмного существ";
                        comment.style.opacity = "1";
                        commentText.style.fontSize = "20px";
                        setTimeout(function () {
                            comment.style.opacity = "0"
                        }, 1500);
                    }
                    attack()
                    manabarFilling(game.player1.Mana, myManaElement, game.player1.CounterOfMoves)
                }
                if (game.player2.turn && clientId === game.player2.name) {
                    const cards = document.querySelectorAll(".cards__card")
                    mouseOver(game, cards)
                    if (cardsNumber <= 7) {
                        dragNDrop()
                    }
                    else {
                        const comment = document.getElementById("comment");
                        const commentText = document.getElementById("commentText");
                        commentText.innerText = "У меня слишком\nмного существ";
                        comment.style.opacity = "1";
                        commentText.style.fontSize = "20px";
                        setTimeout(function () {
                            comment.style.opacity = "0"
                        }, 1500);
                    }
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
                    const cards = document.querySelectorAll(".cards__card")
                    mouseOver(game, cards)
                    if (cardsNumber <= 7) {
                        dragNDrop()
                    }
                    else {
                        const comment = document.getElementById("comment");
                        const commentText = document.getElementById("commentText");
                        commentText.innerText = "У меня слишком\nмного существ";
                        comment.style.opacity = "1";
                        commentText.style.fontSize = "20px";
                        setTimeout(function () {
                            comment.style.opacity = "0"
                        }, 1500);
                    }
                    if (game.player1.HP > 0) {
                        yourTurn()
                    }
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
                    const cards = document.querySelectorAll(".cards__card")
                    mouseOver(game, cards)
                    if (cardsNumber <= 7) {
                        dragNDrop()
                    }
                    else {
                        const comment = document.getElementById("comment");
                        const commentText = document.getElementById("commentText");
                        commentText.innerText = "У меня слишком\nмного существ";
                        comment.style.opacity = "1";
                        commentText.style.fontSize = "20px";
                        setTimeout(function () {
                            comment.style.opacity = "0"
                        }, 1500);
                    }
                    if (game.player2.HP > 0) {
                        yourTurn()
                    }
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
                if (game.player1.turn && clientId === game.player1.name) {
                    const cards = document.querySelectorAll(".cards__card")
                    mouseOver(game, cards)
                    if (cardsNumber <= 7) {
                        dragNDrop()
                    }
                    else {
                        const comment = document.getElementById("comment");
                        const commentText = document.getElementById("commentText");
                        commentText.innerText = "У меня слишком\nмного существ";
                        comment.style.opacity = "1";
                        commentText.style.fontSize = "20px";
                        setTimeout(function () {
                            comment.style.opacity = "0"
                        }, 1500);
                    }
                    attack()
                }
                if (game.player2.turn && clientId === game.player2.name) {
                    const cards = document.querySelectorAll(".cards__card")
                    mouseOver(game, cards)
                    if (cardsNumber <= 7) {
                        dragNDrop()
                    }
                    else {
                        const comment = document.getElementById("comment");
                        const commentText = document.getElementById("commentText");
                        commentText.innerText = "У меня слишком\nмного существ";
                        comment.style.opacity = "1";
                        commentText.style.fontSize = "20px";
                        setTimeout(function () {
                            comment.style.opacity = "0"
                        }, 1500);
                    }
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
            case "bot attack":
                console.log("bot attack")
                if (cardsNumber <= 7) {
                    dragNDrop()
                }
                else {
                    const comment = document.getElementById("comment");
                    const commentText = document.getElementById("commentText");
                    commentText.innerText = "У меня слишком\nмного существ";
                    comment.style.opacity = "1";
                    commentText.style.fontSize = "20px";
                    setTimeout(function () {
                        comment.style.opacity = "0"
                    }, 1500);
                }
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
                console.log("ability")
                if (cardsNumber <= 7) {
                    dragNDrop()
                }
                else {
                    const comment = document.getElementById("comment");
                    const commentText = document.getElementById("commentText");
                    commentText.innerText = "У меня слишком\nмного существ";
                    comment.style.opacity = "1";
                    commentText.style.fontSize = "20px";
                    setTimeout(function () {
                        comment.style.opacity = "0"
                    }, 1500);
                }
                attack()
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

function checkVictoryOrLoose(game) {
    if (game != null || game != undefined || game !=  new GameTable()) {
        if (game.player1.HP <= 0 && clientId == game.player1.name) {
            lose()
            socket.send(JSON.stringify({
                Type: "defeat",
                Data: {}
            }))
        }

        if (game.player2.HP <= 0 && clientId == game.player2.name ) {
            lose()
            socket.send(JSON.stringify({
                Type: "defeat",
                Data: {}
            }))
        }

        if (game.player1.HP <= 0 && clientId != game.player1.name) {
            victory()
            socket.send(JSON.stringify({
                Type: "defeat",
                Data: {}
            }))
        }

        if (game.player2.HP <= 0 && clientId != game.player2.name ) {
            victory()
            socket.send(JSON.stringify({
                Type: "defeat",
                Data: {}
            }))
        }
    }
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