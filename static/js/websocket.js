import {CardData, GameTable, Player} from "./models.js";

import {game, setGame, stateMachine} from "./game.js"

export const socket = new WebSocket("ws://localhost:3000/ws");

const endTurnButton = document.getElementById('endturn');

function manabarFilling(mana) {
    const arrayOfCrystals = [];

    const manaElement = document.getElementById('MyMana');
    const manabar = document.getElementById('Manabar');

    for (let i = 1; i <= mana; i++) {
        const manaCrystalImage = document.createElement('img');
        manaCrystalImage.src = '../static/images/field/mana.png';
        manaCrystalImage.setAttribute('class', 'manabar__crystall');
        arrayOfCrystals.push(manaCrystalImage);
    }

    manaElement.textContent = mana + '/10';
    manabar.replaceChildren(...arrayOfCrystals);
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

    const manaElement = document.getElementById('MyMana');
    let mana = parseInt(manaElement.textContent);
    const manabar = document.getElementById('Manabar');

    const field = document.querySelector('.background__field');
    const hand = document.querySelector('.hand-and-manabar__hand');

    const startSubmit = document.getElementById('StartSubmit');
    let cardsHeader = document.querySelector('.cards__header');
    let cardsStart = document.querySelectorAll('.cards__card_start');
    console.log(cardsStart)
    const handCards = document.querySelector('.hand__cards_start');
    manabarFilling(10);

    let swapCardsId = [];
    let img

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

function start() {
    const manaElement = document.getElementById('MyMana');
    let mana = parseInt(manaElement.textContent);
    const manabar = document.getElementById('Manabar');

    const field = document.querySelector('.background__field');
    const hand = document.querySelector('.hand-and-manabar__hand');

    const startSubmit = document.getElementById('StartSubmit');
    let cardsHeader = document.querySelector('.cards__header');
    let cards = document.querySelectorAll('.cards__card_start');
    console.log(cards)
    const handCards = document.querySelector('.hand__cards_start');
    if (startSubmit) {
        startSubmit.addEventListener('click', (evt) => {
            hand.classList.remove('hand-and-manabar__hand_start');
            for (let i = 0; i < cards.length; i++) {
                cards[i].classList.remove('cards__card_start');
            }

            handCards.removeChild(startSubmit);
            handCards.removeChild(cardsHeader);
            handCards.classList.remove('hand__cards_start');

            let replacedCardIds = [];

            Array.prototype.forEach.call(cards, function (card) {
                if (card.classList.contains('cards__card_swap')) {
                    card.classList.remove('cards__card_swap');
                    if (card.lastChild.tagName === 'IMG') {
                        console.log(card.lastChild)
                        card.removeChild(card.lastChild)
                    }
                    console.log('card', card)
                    replacedCardIds.push(parseInt(card.getAttribute('id')));
                }
                console.log(replacedCardIds);
            });

            const dataToSend = {
                type: "exchange cards",
                data: replacedCardIds
            }

            console.log(JSON.stringify(dataToSend))

            socket.send(JSON.stringify(dataToSend))
        })
    }
}

// startSubmit.addEventListener('click', (evt) => {
//         hand.classList.remove('hand-and-manabar__hand_start');
//         for (i = 0; i < cards.length; i++) {
//             cards[i].classList.remove('cards__card_start');
//         }
//
//         handCards.removeChild(startSubmit);
//         handCards.removeChild(cardsHeader);
//         handCards.classList.remove('hand__cards_start');
//
//         let replacedCardIds = [];
//
//         Array.prototype.forEach.call(cards, function (card) {
//             if (card.classList.contains('cards__card_swap')) {
//                 card.classList.remove('cards__card_swap');
//                 if (card.lastChild.tagName === 'IMG') {
//                     console.log(card.lastChild)
//                     card.removeChild(card.lastChild)
//                 }
//                 console.log('card', card)
//                 replacedCardIds.push(parseInt(card.getAttribute('id')));
//             }
//             console.log(replacedCardIds);
//         });
//
//         const dataToSend = {
//             type: "exchange cards",
//             data: replacedCardIds
//         }
//
//         console.log(JSON.stringify(dataToSend))
//
//         socket.send(JSON.stringify(dataToSend))

// const options = {
//     method: 'POST',
//     body: JSON.stringify(replacedCardIds),
//     headers: {
//         'Content-Type': 'application/json'
//     }
// };
//
// // Отправка данных на сервер и замена непригодных карточек на случайные
// fetch("/api/post", options)
//     .then(response => response.json())
//     .then(data => {
//         const cardsFromBack = data.cards;
//         if (cardsFromBack.length > 0) {
//             console.log(cards)
//             console.log(cardsFromBack)
//             for (i = 0; i < cardsFromBack.length; i++) {
//                 console.log(cards[i])
//                 console.log(cardsFromBack[i].Portrait)
//                 // cards[i].style.background = ''
//                 const encodedUrl = cardsFromBack[i].Portrait.replace(/ /g, "%20");
//                 cards[i].style.background = `url(${encodedUrl})`;
//                 // cards[i].style.backgroundSize = "cover"
//                 cards[i].setAttribute("data-id", cardsFromBack[i].CardID)
//             }
//         }
//
//     })
//     .catch(error => {
//         console.log(error);
//     });


function afterStart() {
    function getCoords(elem) {
        var box = elem.getBoundingClientRect();
        return {
            top: box.top + scrollY,
            left: box.left + scrollX
        };
    }

    const manaElement = document.getElementById('MyMana');
    console.log(manaElement, "manaElement")
    let mana = parseInt(manaElement.textContent);
    const manabar = document.getElementById('Manabar');

    const field = document.querySelector('.background__field');
    const hand = document.querySelector('.hand-and-manabar__hand');

    const startSubmit = document.getElementById('StartSubmit');
    let cardsHeader = document.querySelector('.cards__header');
    let cards = document.querySelectorAll('.cards__card_start');
    console.log(cards)
    const handCards = document.querySelector('.hand__cards_start');
    const cardsElement = document.querySelector('.cards')

    cards = document.getElementsByClassName('cards__card');
    for (const card of cards) {
        card.draggable = true;
    }
    const handLimits = 520;
    cards = document.getElementsByClassName('cards__card');
    if (!startSubmit) {
        for (var i = 0; i < cards.length; i++) {
            (function (card) {
                card.onmousedown = function (e) {
                    if (card.classList.contains('cards__card')) {
                        let manaSelectedCard = parseInt(card.querySelector('.card__mana').textContent);
                        console.log(manaSelectedCard, "manaSelecteCard")
                        console.log(mana, "mana")
                        if ((mana - manaSelectedCard) < 0) {
                            alert("Недостаточно маны");
                            return;
                        } else {
                            var coords = getCoords(card);
                            var shiftX = e.pageX - coords.left;
                            var shiftY = e.pageY - coords.top;

                            card.style.position = 'absolute';
                            moveAt(e);

                            card.style.zIndex = 1000;

                            function moveAt(e) {
                                card.style.left = e.pageX - shiftX + 'px';
                                card.style.top = e.pageY - shiftY + 'px';
                            }

                            document.onmousemove = function (e) {
                                moveAt(e);
                            };

                            card.onmouseup = function () {
                                document.onmousemove = null;
                                card.onmouseup = null;

                                if (parseInt(card.style.top) < handLimits) {
                                    let fieldEmpty = field.querySelector('.field__empty');
                                    if (fieldEmpty) {
                                        field.removeChild(fieldEmpty);
                                    }
                                    field.appendChild(card);
                                    card.style.position = 'static';
                                    card.classList.remove('cards__card');
                                    card.classList.add('field__card');

                                    card.classList.add('canAttack');

                                    mana = mana - manaSelectedCard;

                                    // if (mana >=2)
                                    // {
                                    //     selectedHeroPowerElement.classList.add('canAttack');
                                    //     attack(selectedHeroPowerElement);
                                    // }

                                    attack(card);
                                    manabarFilling(mana);
                                } else {
                                    cardsElement.appendChild(card);
                                    card.style.position = 'static';
                                }

                                const dataToSend = {
                                    type: "card drag",
                                    data: {}
                                }
                                socket.send(JSON.stringify(dataToSend))
                            }
                        }
                        ;
                    }
                };
                card.ondragstart = function () {
                    return false;
                };
            })(cards[i]);
        }


        var canAttack = new Boolean(false);

        function attack(card) {
            if (card.classList.contains('canAttack')) {
                card.addEventListener("mousedown", function (e) {
                    var svgField = document.getElementById('svg');
                    var xOrigin = card.offsetLeft + card.offsetWidth/2;
                    var yOrigin = card.offsetTop + card.offsetHeight/2;
                    svg.style.display = "block";
                    document.getElementById("arrowcursor").style.visibility = "visible";
                    document.body.style.cursor = "none";


                    const cardAttack = card.querySelector('.card__attack').textContent

                    document.body.addEventListener('mousemove', function (e2) {
                        var xDest = e2.clientX;
                        var yDest = e2.clientY;
                        var angleDeg = Math.atan2(yDest - yOrigin, xDest - xOrigin) * 180 / Math.PI;
                        var deg = angleDeg + 90;
                        document.getElementById("arrowcursor").style.left = xDest + 'px';
                        document.getElementById("arrowcursor").style.top = yDest + 30 + 'px';
                        document.getElementById("arrowcursor").style.transform = 'rotate(' + deg + 'deg) translate(-50%, -110%)';
                        svgpath.setAttribute('d', 'M' + xDest + ',' + (yDest - 75) + ' ' + xOrigin + ',' + (yOrigin - 98) + '');
                        // opponentHeroElement.addEventListener("mouseover", function () {
                        //     document.getElementById("innercursor").style.visibility = "visible";
                        //     document.getElementById("outercursor").style.visibility = "visible";
                        //     document.getElementById("innercursor").style.left = xDest + 'px';
                        //     document.getElementById("innercursor").style.top = yDest + 'px';
                        //     document.getElementById("outercursor").style.left = xDest + 'px';
                        //     document.getElementById("outercursor").style.top = yDest + 'px';
                        // });

                        opponentHeroElement.onclick = function () {
                            if (svg.style.display == "block") {
                                opponentheroHealthElement.textContent = String(Number(opponentheroHealthElement.textContent) - parseInt(cardAttack));
                                opponentheroHealthElement.style.color = '#c70d0d';
                                if (opponentheroHealthElement.textContent <= 0) { Victory() }
                                setTimeout(function () {
                                    opponentheroHealthElement.style.color = '#FFFFFF';
                                }, 2000);
                            };
                            svg.style.display = "none";
                            document.body.style.cursor = "url(../static/images/cursor/cursor.png) 10 2, auto";
                            document.getElementById("arrowcursor").style.visibility = "hidden";
                            document.getElementById("innercursor").style.visibility = "hidden";
                            document.getElementById("outercursor").style.visibility = "hidden";
                            card.classList.remove('canAttack');
                        };
                    });
                })
            }
        };

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
            // player1HealthValue -= 10;
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
        function Victory() {
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
            const cardsHand = document.getElementById('cards');
            while (cardsHand.firstElementChild) {
                cardsHand.removeChild(cardsHand.firstElementChild)
            }
            for (const cardInHand of game.player1.hand) {
                console.log(game)
                let newCardElement = document.createElement('div');
                newCardElement.className = "cards__card cards__card_start";
                newCardElement.style.width = '94px';
                newCardElement.style.height = '135px';
                newCardElement.id = `${cardInHand.cardID}`;
                newCardElement.style.backgroundImage = `url(../..${cardInHand.portrait})`
                newCardElement.style.backgroundSize = `cover`;

                const manaElement = document.createElement('span');
                manaElement.className = "card__mana";
                manaElement.textContent = cardInHand.mana;

                const attackElement = document.createElement('span')
                attackElement.className = "card__attack"
                attackElement.textContent = cardInHand.attack

                newCardElement.appendChild(manaElement);
                newCardElement.appendChild(attackElement)
                cardsHand.appendChild(newCardElement);
            }
            manabarFilling(10)
            startBefore()
            start()
            afterStart()
            stateMachine.processEvent("start game");
            break;
        case "turn":
            console.log(message);
            let game__ = ParseDataToGameTable(message.data);
            setGame(game__)
            const cardPlayer2 = document.getElementById('background__field_opp');
            while (cardPlayer2.firstElementChild) {
                cardPlayer2.removeChild(cardPlayer2.firstElementChild)
            }
            for (const cardOnTable of game.player2.cards) {
                console.log(cardOnTable)
                let newCardElement = document.createElement('div');
                newCardElement.className = "field__empty_opp";
                newCardElement.style.width = '94px';
                newCardElement.style.height = '135px';
                newCardElement.id = `${cardOnTable.cardID}`;
                newCardElement.style.backgroundImage = `url(../..${cardOnTable.portrait})`
                newCardElement.style.backgroundSize = `cover`;

                const hpElement = document.createElement("span")
                hpElement.textContent = cardOnTable.hp
                newCardElement.appendChild(hpElement)

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
                endTurnButton.removeAttribute('disabled');
                const dataToSend = {
                    type: "end turn",
                    data: {}
                }
                socket.send(JSON.stringify(dataToSend));
            }
            stateMachine.processEvent("turn");
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