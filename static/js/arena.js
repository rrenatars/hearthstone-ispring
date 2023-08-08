import { socket } from "./websocket.js";
import { socketInit } from "./websocket.js";

import { enemyTurnRun } from "./enemy-turn.js";
import { dragNDrop } from "./dragndrop.js";

enemyTurnRun()

socketInit()
var battleSound = new Audio("../sounds/battle.wav");
var battleSoundLoaded = false;

battleSound.addEventListener('loadeddata', function () {
    battleSoundLoaded = true;
    battleSound.loop = true;
}, false);
document.addEventListener("click", function () {
    battleSound.play();
}, { once })
const startSubmit = document.getElementById("StartSubmit")
console.log(startSubmit)
if (!startSubmit) {
    console.log('fadfaf')
    dragNDrop()
}


