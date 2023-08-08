const cards = document.querySelectorAll('.cards__card');

let currentCard = null;

const mouseUp = () => {
    window.removeEventListener('mousemove', drag, true);
    if (currentCard) {
        currentCard.classList.remove("cards__card_drag");
        currentCard.classList.add("cards__card");
        currentCard = null;
    }
};

const mouseDown = (e) => {
    currentCard = e.currentTarget;
    window.addEventListener('mousemove', drag, true);
};

const drag = (e) => {
    e.preventDefault();
    if (currentCard) {
        currentCard.classList.remove("cards__card");
        currentCard.classList.add("cards__card_drag");
        currentCard.style.position = 'absolute';
        currentCard.style.top = e.clientY - 30 + 'px';
        currentCard.style.left = e.clientX - 30 + 'px';
    }
};

window.onload = () => {
    for (const card of cards) {
        card.addEventListener('mousedown', mouseDown, false);
    }
    window.addEventListener('mouseup', mouseUp, false);
};
