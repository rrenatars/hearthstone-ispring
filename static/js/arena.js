import { socket } from "./websocket.js";
import { socketInit } from "./websocket.js";

import { enemyTurnRun } from "./enemy-turn.js";
import { dragNDrop } from "./dragndrop.js";

enemyTurnRun()

socketInit()


const startSubmit = document.getElementById("StartSubmit")
console.log(startSubmit)
if (!startSubmit) {
    console.log('fadfaf')
    dragNDrop()
}


