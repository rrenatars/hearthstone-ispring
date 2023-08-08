import {game} from "./game.js";
import {socket} from "./websocket.js";

const beforeStyle = document.createElement("style");
document.head.appendChild(beforeStyle);

function animateCards(b, s) {
    beforeStyle.innerHTML = `.cards__card_drag::before {` +
        `filter: brightness(2) sepia(1) hue-rotate(180deg) saturate(` + s + `) blur(` + b + `px);
    }`;

    setTimeout(function () {
        if (b === 9) {
            animateCards(6, s);
        } else if (s === 16) {
            animateCards(b + 1, 4);
        } else {
            animateCards(b + 1, s + 1)
        }
    }, 500);
}

function greenButton() {
    const cardsOnField = document.querySelectorAll(".field__card")
    const cardsHand = document.querySelectorAll(".cards__card")

    for (const card of cardsOnField) {
        if (card.classList.contains("canAttack")) {
            return
        }
    }

    for (const card of cardsHand) {
        if (card.classList.contains("cards__card_enable-to-drag")) {
            return
        }
    }
    const endTurnButton = document.getElementById('endturn');
    endTurnButton.style.transition = "all 2.5s";
    endTurnButton.style.backgroundImage = "url(../static/images/field/end-turn-green.png)";
    endTurnButton.style.animation = "burn2 1.5s linear infinite alternate";
}

export function dragNDrop() {
    function getCoords(elem) {
        var box = elem.getBoundingClientRect();
        return {
            top: box.top + scrollY,
            left: box.left + scrollX
        };
    }

    const field = document.querySelector('.background__field');

    const cardsElement = document.querySelector('.cards')

    let cards = document.getElementsByClassName('cards__card');
    for (const card of cards) {
        card.draggable = true;
    }

    let cardsNumber = document.querySelector(".field__card")

    const handLimits = 520;
    for (var i = 0; i < cards.length; i++) {
        (function (card) {
            card.onmousedown = function (e) {
                if (card.classList.contains('cards__card')) {
                    const manaElement = document.getElementById("MyMana")
                    let mana = parseInt(manaElement.textContent)
                    let manaSelectedCard = parseInt(card.querySelector('.card__mana').textContent);

                    if ((mana - manaSelectedCard) < 0) {
                        const comment = document.getElementById("comment");
                        const commentText = document.getElementById("commentText");
                        commentText.innerText = "Мне не\nхватает маны.";
                        comment.style.opacity = "1";
                        commentText.style.fontSize = "20px";
                        setTimeout(function () {
                            comment.style.opacity = "0"
                        }, 1500);
                        return;
                    } else if (cardsNumber == 7) {
                        console.log("cards Number", cardsNumber)
                        const comment = document.getElementById("comment");
                        const commentText = document.getElementById("commentText");
                        commentText.innerText = "У меня слишком\nмного существ";
                        comment.style.opacity = "1";
                        commentText.style.fontSize = "20px";
                        setTimeout(function () {
                            comment.style.opacity = "0"
                        }, 1500);
                    } else {
                        var coords = getCoords(card);
                        var shiftX = e.pageX - coords.left;
                        var shiftY = e.pageY - coords.top;

                        card.style.position = 'absolute';
                        console.log("card drag", card)
                        card.classList.remove("cards__card")
                        card.classList.remove("cards__card_enable-to-drag")
                        card.classList.add("cards__card_drag")

                        let cardsNotToDrag = document.querySelectorAll(".cards__card")
                        cardsNotToDrag.forEach((cardNotToDrag) => {
                            cardNotToDrag.classList.remove("cards__card")
                            cardNotToDrag.classList.add("cards__card_hover-off")
                        });

                        card.style.zIndex = 1000;
                        const cardPortraitUrl = card.querySelector(".cards__card_inner").style.backgroundImage;
                        function mustype(minion) {
                            switch (minion) {
                                case 'argent-squire':return ".ogg"
                                case 'bluegill-warrior':return ".ogg"
                                case 'boar-rocktusk':return ".ogg"
                                case 'boulderfist-ogre':return ".ogg"
                                case 'emperor-cobra':return ".ogg"
                                case 'frostwolf-fighter':return ".ogg"
                                case 'goblin-bodyguard':return ".ogg"
                                case 'goldshire-soldier':return ".ogg"
                                case 'grizzly-steelmech':return ".ogg"
                                case 'scarlet-crusader':return ".ogg"
                                case 'shieldbearer':return ".ogg"
                                case 'stormwind-knight':return ".ogg"
                                case 'wisp':return ".ogg"
                                case 'wolf-rider':return ".ogg"
                            }
                            return ".wav"
                        }
                        const filename = cardPortraitUrl.match(/url\("\.\.\/\.\.\/static\/images\/cards-in-hand\/(.*?)\.png"/)[1];
                        let src = "../static/sounds/" + filename  + "-summon" + mustype(filename)
                        const summonSound = new Audio(src);
                        summonSound.addEventListener('loadeddata', function () {
                            summonSound.play();
                        }, false);
                        const beforeStyle = document.createElement('style');
                        beforeStyle.innerHTML = `
            .cards__card_drag::before {
                background-image: url(` + cardPortraitUrl + `);
            }
            `;
                        // Добавляем созданный стиль в голову документа
                        document.head.appendChild(beforeStyle);

                        animateCards(6, 4);

                        function moveAt(e) {
                            card.style.left = e.pageX - 30 + 'px';
                            card.style.top = e.pageY - 30 + 'px';
                        }

                        document.onmousemove = function (e) {
                            setTimeout(function () {
                                moveAt(e);
                            }, 100);
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
                                card.classList.remove('cards__drag');
                                card.classList.add('field__card');

                                cardsNotToDrag = document.querySelectorAll(".cards__card")
                                cardsNotToDrag.forEach((cardNotToDrag) => {
                                    cardNotToDrag.classList.add("cards__card")
                                    cardNotToDrag.classList.remove("cards__card_hover-off")
                                });

                                // for (const card of cards) {
                                //     card.classList.add("cards__card")
                                //     card.classList.remove("cards__card_if-drag-card")
                                // }
                                cardsNumber = document.querySelector(".field__card")
                                socket.send(JSON.stringify({
                                    type: "card drag",
                                    data: {
                                        idCardInHand: card.id,
                                        player: (game.player1.turn ? true : false)
                                    },
                                }))
                            } else {
                                card.classList.remove("cards__card_drag")
                                card.classList.add("cards__card")
                                card.classList.add("cards__card_enable-to-drag")
                                cardsElement.appendChild(card);
                                card.style.position = 'static';

                                cardsNotToDrag = document.querySelectorAll(".cards__card_hover-off")
                                cardsNotToDrag.forEach((cardNotToDrag) => {
                                    cardNotToDrag.classList.add("cards__card")
                                    cardNotToDrag.classList.remove("cards__card_hover-off")
                                });
                            }
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