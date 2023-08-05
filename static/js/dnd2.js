const card = document.querySelector('.cards__outer');

const mouseUp = () => window.removeEventListener('mousemove', drag, true);
const mouseDown = e => window.addEventListener('mousemove', drag, true);
const drag = e => {
    e.preventDefault()
    card.classList.remove("cards_card")
    card.classList.add("cards__drag")
    card.style.position = 'absolute';
    card.style.top = e.clientY - 150 + 'px';
    card.style.left = e.clientX - 100 + 'px';
};

window.onload = () => {
    card.addEventListener('mousedown', mouseDown, false);
    window.addEventListener('mouseup', mouseUp, false);
};