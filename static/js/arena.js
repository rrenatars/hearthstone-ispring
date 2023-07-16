import { socket } from "./websocket.js";

import { game, setGame, stateMachine } from "./game.js"

const manaElement = document.getElementById('MyMana');
let mana = parseInt(manaElement.textContent);
const manabar = document.getElementById('Manabar');
const endTurnButton = document.getElementById('endturn');
var canAttack = new Boolean(false);

const urlParams = new URLSearchParams(window.location.search);
const heroClass = urlParams.get('heroclass');
const difficulty = urlParams.get('difficulty');
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

function manabarFilling() {
    const arrayOfCrystals = [];

    for (let i = 1; i <= mana; i++) {
        const manaCrystalImage = document.createElement('img');
        manaCrystalImage.src = '../static/images/field/mana.png';
        manaCrystalImage.setAttribute('class', 'manabar__crystall');
        arrayOfCrystals.push(manaCrystalImage);
    }

    manaElement.textContent = mana + '/10';
    manabar.replaceChildren(...arrayOfCrystals);
}

manabarFilling();

const field = document.querySelector('.background__field');
const hand = document.querySelector('.hand-and-manabar__hand');

function getCoords(elem) {
    var box = elem.getBoundingClientRect();
    return {
        top: box.top + scrollY,
        left: box.left + scrollX
    };
}

const startSubmit = document.getElementById('StartSubmit');
let cardsHeader = document.querySelector('.cards__header');
let cards = document.querySelectorAll('.cards__card_start');
const handCards = document.querySelector('.hand__cards_start');

let swapCardsId = [];
let img

Array.from(cards).forEach(function (card) {
    card.addEventListener('click', function () {
        if (card.classList.contains('cards__card_swap')) {
            card.classList.remove('cards__card_swap');
            card.removeChild(img)
        } else {
            card.classList.add('cards__card_swap');
            img = document.createElement("img")
            img.src = "/static/images/cross.png"
            card.appendChild(img)
        }
    });
});



startSubmit.addEventListener('click', (evt) => {
        hand.classList.remove('hand-and-manabar__hand_start');
        for (i = 0; i < cards.length; i++) {
            cards[i].classList.remove('cards__card_start');
        }
        handCards.removeChild(startSubmit);
        handCards.removeChild(cardsHeader);
        handCards.classList.remove('hand__cards_start');

        let replacedCardIds = [];

        Array.prototype.forEach.call(cards, function (card) {
            if (card.classList.contains('cards__card_swap')) {
                card.classList.remove('cards__card_swap');
                card.removeChild(img)
                console.log('card', card)
                replacedCardIds.push(parseInt(card.getAttribute('data-id')));
            }
            console.log(replacedCardIds);
        });

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

        cards = document.getElementsByClassName('cards__card');
        for (const card of cards) {
            card.draggable = true;
        }
        const handLimits = 420;
        cards = document.getElementsByClassName('cards');
        for (var i = 0; i < cards.length; i++) {
            (function (card) {
                card.onmousedown = function (e) {
                    if (card.classList.contains('cards__card')) {
                        let manaSelectedCard = parseInt(card.querySelector('.card__mana').textContent);
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
                                top = e.pageY - shiftY;
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
                                    manabarFilling();
                                } else {
                                    hand.appendChild(card);
                                    card.style.position = 'static';
                                }
                                socket.send("card drag")
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
    }
)

function attack(card) {
    if (card.classList.contains('canAttack')) {
        card.addEventListener("mousedown", function (e) {
            var xOrigin = e.clientX;
            var yOrigin = e.clientY;
            svg.style.display = "block";
            document.getElementById("arrowcursor").style.visibility = "visible";
            document.body.style.cursor = "none";

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
                        opponentheroHealthElement.textContent = String(Number(opponentheroHealthElement.textContent) - 2);
                        opponentheroHealthElement.style.color = '#c70d0d';
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

selectedHeroElement.addEventListener("click", function () {
    player1HealthValue -= 10;
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
opponentHeroElement.addEventListener("click", function () {
    player2HealthValue -= 10;
    console.log('player2 Health Value = ', player2HealthValue);
    if (player2HealthValue <= 0) {
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
});

endTurnButton.addEventListener("click", function () {
    document.body.style.cursor = "url(../static/images/cursor/spectate.png) 10 2, auto";
    endTurnButton.style.backgroundImage = "url(../static/images/field/enemyturn.png)";
    endTurnButton.setAttribute('disabled', '');
    socket.send("end turn")
    enemyTurn()
});

function enemyTurn() {
    newEnemyCard()
};


function newEnemyCard() {
    const cardSet = document.getElementById("enemycards");
    const card = document.getElementsByClassName("enemycard");
    const newCard = document.createElement('div');
    let iValue;
    for (var i = 0; i < card.length; i++) {
        iValue = card[i].style.cssText;
        iValue = iValue.split(':').pop();
        iValue = iValue.replace(';', '');
        iValue = Number(iValue) + 0.35;
        card[i].style = "--i:" + String(iValue);
    }
    iValue = card[i - 1].style.cssText;
    iValue = iValue.split(':').pop();
    iValue = iValue.replace(';', '');
    iValue = Number(iValue) - 0.7;
    newCard.style = "--i:" + String(iValue);
    newCard.classList.add("enemycard");
    setTimeout(() => {
        cardSet.appendChild(newCard);
    }, 400);
};


