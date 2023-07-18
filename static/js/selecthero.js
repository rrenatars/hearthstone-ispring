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

    window.location.href = url;
}
