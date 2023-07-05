const cardsListElement = document.querySelector(`.main__cards`);
const fieldListElement = document.querySelector('.main__field');

cardsListElement.addEventListener(`dragstart`, (evt) => {
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
    } else if (activeElement !== null) {
        fieldListElement.appendChild(activeElement);
        fieldListElement.removeChild(currentElement);
    }

});
