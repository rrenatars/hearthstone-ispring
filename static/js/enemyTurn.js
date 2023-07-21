import { socket } from "./websocket.js";
import {attack} from "./attack.js";

export function enemyTurnRun() {
    const endTurnButton = document.getElementById('endturn');

    endTurnButton.addEventListener("click", function () {
        document.body.style.cursor = "url(../static/images/cursor/spectate.png) 10 2, auto";
        endTurnButton.style.backgroundImage = "url(../static/images/field/enemyturn.png)";
        endTurnButton.setAttribute('disabled', '');

        const dataToSend = {
            type: "end turn",
            data: {}
        }
        socket.send(JSON.stringify(dataToSend))
        newEnemyCard()
    });

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