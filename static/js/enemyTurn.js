import { socket } from "./websocket.js";
import { manabarFilling } from "./manabarFilling.js";

export function enemyTurnRun() {
    const endTurnButton = document.getElementById('endturn');
    const manaElement = document.getElementById("MyMana")
    endTurnButton.addEventListener("click", function () {
        document.body.style.cursor = "url(../static/images/cursor/spectate.png) 10 2, auto";
        endTurnButton.style.backgroundImage = "url(../static/images/field/enemyturn.png)";
        endTurnButton.setAttribute('disabled', '');
        const dataToSend = {
            type: "end turn",
            data: {}
        }
        newEnemyCard();
        setTimeout(() => {
            socket.send(JSON.stringify(dataToSend))
            enemyTurn();
            const cardSet = document.getElementById("enemycards");
            const card = document.getElementsByClassName("enemycard");
            cardSet.removeChild(card[0]);
            for (var i = 0; i < card.length; i++) {
                card[i].style = "--i: " + String(Math.min(0.525 * (card.length - 2), 1.75) * (1 - i * 2 / (card.length - 1))) + ";";
            }
        }, 400);
    });

    function enemyTurn() {
        manabarFilling(10, manaElement);
        const urlParams = new URLSearchParams(window.location.search);
        const heroClass = urlParams.get('heroclass');
        const selectedHeroPowerElement = document.getElementById('heropower');
        selectedHeroPowerElement.style.backgroundImage = 'url(../static/images/field/' + heroClass + 'power.png)';
        const card = document.getElementsByClassName("enemycard");

    };
    function newEnemyCard() {
        const cardSet = document.getElementById("enemycards");
        const card = document.getElementsByClassName("enemycard");
        const newCard = document.createElement('div');
        for (var i = 0; i < card.length; i++) {
            card[i].style = "--i: " + String(Math.min(0.525 * (card.length - 1), 1.75) * (1 - i * 2 / (card.length))) + ";";
        }
        newCard.style = "--i: " + String(-Math.min(0.525 * (card.length - 1), 1.75)) + ";";
        newCard.classList.add("enemycard");
        cardSet.appendChild(newCard);
    };
}