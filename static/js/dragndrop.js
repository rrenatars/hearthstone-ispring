import {game} from "./game.js";
import {socket} from "./websocket.js";

const beforeStyle = document.createElement("style");
document.head.appendChild(beforeStyle);

function animateCards(b) {
    const cardPortraitUrl = "url_to_your_card_portrait_image";

    beforeStyle.innerHTML = `.cards__card_drag::before {` +
        `filter: brightness(2) sepia(1) hue-rotate(180deg) saturate(4) blur(` + b + `px);
    }`;

    setTimeout(function () {
        if (b === 9) {
            animateCards(6);
        } else {
            animateCards(b + 1);
        }
    }, 500);
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

    const handLimits = 520;
    for (var i = 0; i < cards.length; i++) {
        (function (card) {
            card.onmousedown = function (e) {
                if (card.classList.contains('cards__card')) {
                    const manaElement = document.getElementById("MyMana")
                    let mana = parseInt(manaElement.textContent)
                    let manaSelectedCard = parseInt(card.querySelector('.card__mana').textContent);

                    if ((mana - manaSelectedCard) < 0) {
                        const label = document.getElementById("manaWarning");
                        label.style.visibility = "visible";
                        label.style.opacity = "1";
                        var x = Math.round(e.clientX) - label.offsetWidth / 1.5 + "px";
                        var y = Math.round(e.clientY) - label.offsetHeight / 1.5 + "px";
                        label.style.left = x;
                        label.style.top = y;
                        setTimeout(function () {
                            label.style.visibility = "hidden"
                        }, 1500);
                        label.style.transition = "all 3s";
                        label.style.fontSize = "26px"
                        label.style.opacity = "0"
                        return;
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
                        const cardPortraitUrl = card.querySelector(".cards__card_inner").style.backgroundImage.match(/url\(["']?([^"']+)["']?\)/)[1];
                        const beforeStyle = document.createElement('style');
                        beforeStyle.innerHTML = `
            .cards__card_drag::before {
                background-image: url(` + cardPortraitUrl + `);
            }
            `;
                        // Добавляем созданный стиль в голову документа
                        document.head.appendChild(beforeStyle);

                        animateCards(6);

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