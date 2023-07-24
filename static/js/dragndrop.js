import { attack } from "./attack.js";
import { manabarFilling } from "./manabarFilling.js";
import { game } from "./game.js";
import { socket } from "./websocket.js";

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

                    const selectedHeroPowerElement = document.getElementById('heropower');
                    if (mana >=2)
                    {
                        selectedHeroPowerElement.classList.add('canAttack')
                    }
                    else
                    {
                        selectedHeroPowerElement.classList.remove('canAttack')
                    }

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


                                mana = mana - manaSelectedCard;

                                const manaElement = document.getElementById('MyMana');
                                manabarFilling(mana, manaElement);

                                let cardPortraitUrl = card.getAttribute('style').match(/background-image:\s?url\(['"]?([^'"]+?)['"]?\)/)[1];

                                let creaturePortraitUrl = cardPortraitUrl.replace('cards-in-hand', 'creatures');
                                card.style.backgroundImage = 'url(' + creaturePortraitUrl + ')'
                                card.style.width = '125px'
                                card.style.height = '168px'

                                socket.send(JSON.stringify({
                                    type: "card drag",
                                    data: {
                                        idCardInHand: card.id,
                                        player: (game.player1.turn ? true : false)
                                    },
                                }))
                            } else {
                                cardsElement.appendChild(card);
                                card.style.position = 'static';
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