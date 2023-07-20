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
        socket.send(JSON.stringify(dataToSend))
        enemyTurn()
    });

    function enemyTurn() {
        newEnemyCard();
        manabarFilling(10, manaElement);
        const urlParams = new URLSearchParams(window.location.search);
        const heroClass = urlParams.get('heroclass');
        const selectedHeroPowerElement = document.getElementById('heropower');
        selectedHeroPowerElement.style.backgroundImage = 'url(../static/images/field/' + heroClass + 'power.png)';
        const card = document.getElementsByClassName("enemycard");
        if (card.length < 5) newEnemyCard();
        setTimeout(() => {
            removeEnemyCard();
        }, "1000");
    };
    function removeEnemyCard() {
        const card = document.getElementsByClassName("enemycard");
        if (card.length > 0) {
            const lastCard = card[0];
            lastCard.remove();
        }
    }
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
}