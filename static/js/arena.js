const manaElement = document.getElementById('MyMana');
let mana = parseInt(manaElement.textContent);
const manabar = document.getElementById('Manabar');
const endTurnButton = document.getElementById('endturn');
const urlParams = new URLSearchParams(window.location.search);
const heroClass = urlParams.get('heroclass');
const difficulty = urlParams.get('difficulty');
const selectedHeroElement = document.getElementById('selectedHero');
selectedHeroElement.style.backgroundImage = 'url(../static/images/field/' + heroClass + '.png)';
const selectedHeroPowerElement = document.getElementById('heropower');
selectedHeroPowerElement.style.backgroundImage = 'url(../static/images/field/' + heroClass + 'power.png)';
console.log(difficulty);
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
const hand = document.querySelector('.background__cards');

function getCoords(elem) {
    var box = elem.getBoundingClientRect();
    return {
        top: box.top + scrollY,
        left: box.left + scrollX
    };
}

const handLimits = 420;
let cards = document.getElementsByClassName('cards__card');

// let cards = document.querySelector('.cards__card');
// let cardMana = parseInt(document.querySelector('.card__mana').textContent);

// cards.addEventListener("mousedown", function() {
//     for (var i = 0; i < cards.length; i++) {
//         console.log(cardMana);
//         if (mana < cardMana) {
//             cards[i].style.boxShadow = "none"; //не доделано
//         }
//     }
// });

// for (var i = 0; i < cards.length; i++) {
//     console.log(cardMana);
//     if (mana < cardMana) {
//         cards[i].style.boxShadow = "none";
//     }
// }

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
                            // card.style.backgroundImage = '';

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
    enemyTurn()
});

function enemyTurn() {
    newEnemyCard()
};


function newEnemyCard() {
    const cardSet = document.getElementById("enemycards");
    const card = document.getElementById("enemycard");
    const newCard = document.createElement('div');
    let iValue = card.style.cssText;
    newCard.style = iValue + "1";
    newCard.classList.add("enemycard");
    cardSet.appendChild(newCard);
    console.log(iValue)
}
