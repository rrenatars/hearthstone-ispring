const cardsListElement = document.querySelector(`.main__cards`);
const cardsElements = document.querySelectorAll('.cards__card')
const fieldListElement = document.querySelector('.main__field');
const manaElement = document.getElementById('MyMana');
let mana = manaElement.textContent;

cardsListElement.addEventListener(`dragstart`, (evt) => {
    const selectedCardMana = evt.target.querySelector('.card__mana').textContent;
    tempManaAfterDrag = (parseInt(mana) - parseInt(selectedCardMana));
    if (tempManaAfterDrag <= 0) {
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
    } else if (activeElement !== null) {
        fieldListElement.appendChild(activeElement);
        fieldListElement.removeChild(currentElement);
        manaElement.textContent = tempManaAfterDrag + "/10";
        mana = tempManaAfterDrag;
    }
});

