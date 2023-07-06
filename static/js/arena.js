const endTurnButton = document.getElementById('endturn')
const cardsListElement = document.querySelector(`.background__cards`);
const cardsElements = document.querySelectorAll('.cards__card')
const fieldListElement = document.querySelector('.background__field');
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

cardsListElement.addEventListener(`dragstart`, (evt) => {
    const selectedCardMana = evt.target.querySelector('.card__mana').textContent;
    tempManaAfterDrag = (parseInt(mana) - parseInt(selectedCardMana));
    if (tempManaAfterDrag < 0) {
        evt.preventDefault();
        alert("Недостаточно маны");
        return;
    }
    evt.target.classList.add(`selected`);
});

fieldListElement.addEventListener(`dragend`, (evt) => {
    evt.target.classList.remove(`selected`);
});

cardsListElement.addEventListener(`dragend`, (evt) => {
    evt.target.classList.remove(`selected`);
});

fieldListElement.addEventListener(`dragover`, (evt) => {
    evt.preventDefault();

    const activeElement = cardsListElement.querySelector(`.selected`);
    const currentElement = evt.target;

    const isMoveable = activeElement !== currentElement &&
        currentElement.classList.contains(`field__empty`);

    if (!isMoveable) {
        return;
    }

    const nextElement = currentElement.nextElementSibling;

    if (nextElement !== null && activeElement !== null) {

        fieldListElement.insertBefore(activeElement, nextElement);
        fieldListElement.removeChild(currentElement);
        manaElement.textContent = tempManaAfterDrag + "/10";
        mana = tempManaAfterDrag;
        manabarFilling();
    } else if (activeElement !== null) {
        fieldListElement.appendChild(activeElement);
        fieldListElement.removeChild(currentElement);
        manaElement.textContent = tempManaAfterDrag + "/10";
        mana = tempManaAfterDrag;
        manabarFilling();
    }
});

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