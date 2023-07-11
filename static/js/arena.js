const manaElement = document.getElementById('MyMana');
let mana = parseInt(manaElement.textContent);
const manabar = document.getElementById('Manabar');
const endTurnButton = document.getElementById('endturn');

function manabarFilling() {
    const arr = [];

    for (let i = 1; i <= mana; i++) {
        const manaCrystalImage = document.createElement('img');
        manaCrystalImage.src = '../static/images/field/mana.png';
        manaCrystalImage.setAttribute('class', 'manabar__crystall');
        arr.push(manaCrystalImage);
    }

    manaElement.textContent = mana + '/10';
    manabar.replaceChildren(...arr);
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
cardsHeader = document.querySelector('.cards__header');
let cards = document.querySelectorAll('.cards__card_start');
const handCards = document.querySelector('.hand__cards');

startSubmit.addEventListener('click', () => {
        hand.classList.remove('hand-and-manabar__hand_start');
        for (i = 0; i < cards.length; i++) {
            cards[i].classList.remove('cards__card_start');
        }
        handCards.removeChild(startSubmit);
        handCards.removeChild(cardsHeader);
    }
)

const handLimits = 420;
cards = document.getElementsByClassName('cards__card');
let cardMana = parseInt(document.querySelector('.card__mana').textContent);

for (var i = 0; i < cards.length; i++) {
    (function (card) {
        card.onmousedown = function (e) {
            if (card.classList.contains('cards__card')) {
                let manaSelectedCard = parseInt(card.querySelector('.card__mana').textContent);
                if ((mana - manaSelectedCard) < 0) {
                    alert("Недостаточно маны");
                    return;
                } else {
                    console.log(card);
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
                        console.log('fadf');
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
                            manabarFilling();
                        } else {
                            hand.appendChild(card);
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


endTurnButton.addEventListener("click", function () {
    playerTurn = false;
    document.body.style.cursor = "url(../static/images/cursor/spectate.png) 10 2, auto";
    endTurnButton.style.backgroundImage = "url(../static/images/field/enemyturn.png)";
    endTurnButton.setAttribute('disabled', '');
    enemyTurn();
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


