import { socket } from "./websocket.js";
import { socketInit } from "./websocket.js";

import { enemyTurnRun } from "./enemy-turn.js";
import { dragNDrop } from "./dragndrop.js";
const battleSound = new Audio("../static/sounds/battle.wav");
let battleSoundLoaded = false;

battleSound.addEventListener('loadeddata', function () {
    battleSoundLoaded = true;
    battleSound.loop = true;
    console.log("battle sound")
}, false);
document.addEventListener("click", function () {
    battleSound.play();
}, { once: true})
enemyTurnRun()

socketInit()

const startSubmit = document.getElementById("StartSubmit")
console.log(startSubmit)
if (!startSubmit) {
    console.log('fadfaf')
    dragNDrop()
}


