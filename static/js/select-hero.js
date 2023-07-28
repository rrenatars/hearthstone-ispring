import { socket, socketInit, ParseDataToGameTable } from "./websocket.js";
import { game, setGame, stateMachine } from "./game.js"
socketInit()

function submitForm(event) {
    event.preventDefault();

    const form = document.getElementById('GameForm');
    const formData = new FormData(form);
    const gameModeSelect = document.getElementById('gamemode');
    const heroClass = formData.get('heroclass');
    const gameMode = formData.get('gamemode');
    const difficulty = formData.get('difficulty');
    var url;
    if (gameModeSelect.value === 'singleplayer') {
        url = 'arena?heroclass=' + encodeURIComponent(heroClass) +
            '&difficulty=' + encodeURIComponent(difficulty);
    } else {
        url = 'multiplayer?heroclass=' + encodeURIComponent(heroClass);
    }
    console.log(localStorage.getItem('id'))
    socket.send(JSON.stringify({
        type: "create game",
        data : {
            clientID: localStorage.getItem('id')
        }
    }))

    socket.onmessage = event =>{
        const data = JSON.parse(event.data);

        console.log(data.Type);
        console.log(data.Data.RoomID);
        console.log(data.Data.Game);
        // console.log(e.data,'\n', idRoom)
        url += "&room="+ data.Data.RoomID
        console.log(url)
        setGame(ParseDataToGameTable(data.Data.Game))
        window.location.href = url;
    }
}

document.getElementById("GameForm").addEventListener("submit", function(e){
    submitForm(e)
})

// socketInit()
function handleGameModeChange() {
    const heroClassSelect = document.getElementById('heroclass');
    const gameModeSelect = document.getElementById('gamemode');
    const difficultyDiv = document.getElementById('difficulty');
    const difficultyLabel = document.querySelector('#difficulties label');
    if (gameModeSelect.value === 'singleplayer') {
        difficultyLabel.style.visibility = 'visible';
        difficultyDiv.style.display = 'block';
    } else {
        difficultyDiv.style.display = 'none';
        difficultyLabel.style.visibility = 'hidden';
    }
}