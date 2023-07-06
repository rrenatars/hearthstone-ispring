const cardsListElement = document.querySelector(`.background__cards`);
const fieldListElement = document.querySelector('.background__field');
const fieldEmpty = document.querySelector('.field__empty');
const manaElement = document.getElementById('MyMana');
let mana = parseInt(manaElement.textContent);
const manabar = document.getElementById('Manabar');

function manabarFilling() {
    const arr = [];

    for (let i = 1; i <= mana; i++) {
        const manaCrystalImage = document.createElement('img');
        manaCrystalImage.src = '../static/images/field/mana.png';
        manaCrystalImage.setAttribute('class', 'manabar__crystall');
        arr.push(manaCrystalImage);
    }

    manabar.replaceChildren(...arr);
}

manabarFilling();

var cards = document.getElementsByClassName('cards__card');

for (var i = 0; i < cards.length; i++) {
    (function(card) {
        card.onmousedown = function(e) {
            var coords = getCoords(card);
            var shiftX = e.pageX - coords.left;
            var shiftY = e.pageY - coords.top;

            card.style.position = 'absolute';
            document.body.appendChild(card);
            moveAt(e);

            card.style.zIndex = 1000; // над другими элементами

            function moveAt(e) {
                card.style.left = e.pageX - shiftX + 'px';
                card.style.top = e.pageY - shiftY + 'px';
            }

            document.onmousemove = function(e) {
                moveAt(e);
            };

            card.onmouseup = function() {
                document.onmousemove = null;
                card.onmouseup = null;
            };
        };

        card.ondragstart = function() {
            return false;
        };



    })(cards[i]);
}

function getCoords(elem) {   // кроме IE8-
    var box = elem.getBoundingClientRect();
    return {
        top: box.top + scrollY,
        left: box.left + scrollX
    };
}



//
// cardsListElement.addEventListener(`dragstart`, (evt) => {
//     const selectedCardMana = evt.target.querySelector('.card__mana').textContent;
//     tempManaAfterDrag = (parseInt(mana) - parseInt(selectedCardMana));
//     if (tempManaAfterDrag < 0) {
//         evt.preventDefault();
//         alert("Недостаточно маны");
//         return;
//     }
//     evt.target.classList.add(`selected`);
//     activeElement = cardsListElement.querySelector(`.selected`);
//     activeElement.ondragstart = function() {
//         return false;
//     };
// });
//
// fieldListElement.addEventListener(`dragend`, (evt) => {
//     evt.target.classList.remove(`selected`);
// });
//
// cardsListElement.addEventListener(`dragend`, (evt) => {
//     evt.target.classList.remove(`selected`);
// });
//
// fieldListElement.addEventListener(`dragover`, (evt) => {
//     evt.preventDefault();
//
//     console.log('active', activeElement);
//     const currentElement = evt.target;
//     console.log('current', currentElement);
//
//     const isMoveable = activeElement !== currentElement &&
//         currentElement.classList.contains(`field__empty`);
//
//     if (!isMoveable) {
//         console.log('return');
//         return;
//     }
//
//     const nextElement = currentElement.nextElementSibling;
//     if (nextElement) {
//         console.log('nextElemenent', nextElement);
//     }
//
//     if (nextElement !== null && activeElement !== null) {
//         fieldListElement.insertBefore(activeElement, nextElement);
//         fieldListElement.prepend(fieldEmpty.cloneNode(true));
//         fieldListElement.appendChild(fieldEmpty.cloneNode(true));
//         fieldListElement.removeChild(currentElement);
//         manaElement.textContent = tempManaAfterDrag + "/10";
//         mana = tempManaAfterDrag;
//         manabarFilling();
//     } else if (activeElement !== null) {
//         const nextSibling = activeElement.nextElementSibling;
//         fieldListElement.insertBefore(activeElement, nextSibling);
//         fieldListElement.prepend(fieldEmpty.cloneNode(true));
//         fieldListElement.appendChild(fieldEmpty.cloneNode(true));
//         fieldListElement.removeChild(currentElement);
//         manaElement.textContent = tempManaAfterDrag + "/10";
//         mana = tempManaAfterDrag;
//         manabarFilling();
//     }
// });



const endTurnButton = document.getElementById('endturn');

endTurnButton.addEventListener(
    "click",
    () => {
        opponentTurn()
    },
    false
);

function opponentTurn() {
    playersTurn = false;
    document.body.style.cursor = "url(../static/images/cursor/spectate.png) 10 2, auto";
    endTurnButton.style.backgroundImage = "url(../static/images/field/enemyturn.png)";
};