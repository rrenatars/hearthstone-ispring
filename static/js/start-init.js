import {selectCardsToExchange} from "./tools.js";
import {lose, victory} from "./end-game.js";
import {socket} from "./websocket.js";

let heroClass

export function startBefore() {
    const urlParams = new URLSearchParams(window.location.search);
    heroClass = urlParams.get('heroclass');
    const selectedHeroElement = document.getElementById('selectedHero');
    selectedHeroElement.style.backgroundImage = 'url(../static/images/field/' + heroClass + '.png)';
    const selectedHeroPowerElement = document.getElementById('heropower');
    selectedHeroPowerElement.style.backgroundImage = 'url(../static/images/field/' + heroClass + '-power.png)';
    const heroHealthElement = document.getElementById('Player1HealthValue');

    const hand = document.querySelector('.hand-and-manabar__hand')
    hand.classList.add('hand-and-manabar__hand_start')

    const handCards = document.querySelector('.hand__cards')
    handCards.classList.add('hand__cards_start')

    const cardsInner = document.querySelector(".cards")
    cardsInner.classList.add("cards_start")

    const cardsHeader = document.createElement('p')
    cardsHeader.className = 'cards__header'
    cardsHeader.textContent = 'Start hand'
    handCards.prepend(cardsHeader)

    const startButton = document.createElement('button')
    startButton.className = 'cards__submit'
    startButton.id = 'StartSubmit'
    startButton.textContent = 'OK'
    handCards.appendChild(startButton)

    let cards = document.querySelectorAll('.cards__card')
    const startSubmit = document.getElementById('StartSubmit')

    if (startSubmit) {
        for (let i = 0; i < cards.length; i++) {
            cards[i].classList.add('cards__card_start');
        }

        selectCardsToExchange()
    }
}

export function start() {
    const hand = document.querySelector('.hand-and-manabar__hand');

    const startSubmit = document.getElementById('StartSubmit');
    const cardsHeader = document.querySelector('.cards__header');
    const cards = document.querySelectorAll('.cards__card_start');
    const cardsInner = document.querySelector(".cards_start")
    const handCards = document.querySelector('.hand__cards_start');
    if (startSubmit) {
        startSubmit.addEventListener('click', (evt) => {
            hand.classList.remove('hand-and-manabar__hand_start');

            handCards.removeChild(startSubmit);
            handCards.removeChild(cardsHeader);
            handCards.classList.remove('hand__cards_start');
            cardsInner.classList.remove("cards_start")

            let replacedCardIds = [];

            Array.prototype.forEach.call(cards, function (card) {
                if (card.classList.contains('cards__card_swap')) {
                    card.classList.remove('cards__card_swap');
                    if (card.lastChild.tagName === 'IMG') {
                        card.removeChild(card.lastChild)
                    }
                    replacedCardIds.push(card.id);
                }
            });

            const dataToSend = {
                type: "exchange cards",
                data: {
                    replacedCardIds: replacedCardIds
                }
            }
            socket.send(JSON.stringify(dataToSend))
            setTimeout(function () {
                window.location.reload();
            }, 500)
        })
    }
}

let paladinAbID = 1
let warlockAbID = 2
let hunterAbID = 3
let mageAbID = 4

export function afterStart() {
    const startSubmit = document.getElementById('StartSubmit');
    if (!startSubmit) {
        const urlParams = new URLSearchParams(window.location.search);
        const heroClass = urlParams.get('heroclass');
        const selectedHeroElement = document.getElementById('selectedHero');
        selectedHeroElement.style.backgroundImage = 'url(../static/images/field/' + heroClass + '.png)';
        const selectedHeroPowerElement = document.getElementById('heropower');
        selectedHeroPowerElement.style.backgroundImage = 'url(../static/images/field/' + heroClass + '-power.png)';
        const heroHealthElement = document.getElementById('Player1HealthValue');
        const opponentHeroElement = document.getElementById('opponenthero');
        const opponentheroHealthElement = document.getElementById('Player2HealthValue');
        selectedHeroPowerElement.addEventListener("click", function () {
            if (selectedHeroPowerElement.style.backgroundImage == ('url("../static/images/field/' + heroClass + '-power.png")'))
                switch (heroClass) {
                    case 'hunter':
                        opponentheroHealthElement.textContent -= 2;
                        selectedHeroPowerElement.style.backgroundImage = 'url(../static/images/field/used-power.png)';
                        if (opponentheroHealthElement.textContent <= 0) victory()
                        break;
                    case 'mage':
                        selectedHeroElement.addEventListener('click', () => {
                            if (selectedHeroPowerElement.style.backgroundImage == ('url("../static/images/field/' + heroClass + '-power.png")'))
                                heroHealthElement.textContent = parseInt(heroHealthElement.textContent) - 1;
                            selectedHeroPowerElement.style.backgroundImage = 'url(../static/images/field/used-power.png)';
                        }, {once: true});
                        opponentHeroElement.addEventListener('click', () => {
                            if (selectedHeroPowerElement.style.backgroundImage == ('url("../static/images/field/' + heroClass + '-power.png")'))
                                opponentheroHealthElement.textContent = parseInt(opponentheroHealthElement.textContent) - 1;
                            selectedHeroPowerElement.style.backgroundImage = 'url(../static/images/field/used-power.png)';
                        }, {once: true});
                        break;
                    case 'warlock':
                        heroHealthElement.textContent -= 2;
                        selectedHeroPowerElement.style.backgroundImage = 'url(../static/images/field/used-power.png)';
                        if (heroHealthElement.textContent <= 0) lose()
                        break;
                    case 'paladin':
                        selectedHeroPowerElement.style.backgroundImage = 'url(../static/images/field/used-power.png)';
                        break;
                }

        });
    }
}