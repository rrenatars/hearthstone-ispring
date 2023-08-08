import { socket, socketInit, ParseDataToGameTable } from "./websocket.js";
import { game, setGame, stateMachine } from "./game.js"
//socketInit();

var selectGameMode = 'singleplayer';
var selectDifficulty = 'easy';
var selectHero = 'mage';
const selectGameModeButton = document.getElementById("select-game-mode");
const selectDifficultyButton = document.getElementById('select-bot-difficulty');
const selectHeroButton = document.getElementById('select-class');
const startGameButton = document.getElementById('start-game');
selectGameModeButton.addEventListener("click", function () {
    if ((document.getElementById("easy-button") === null) && (document.getElementById("singleplayer-button") === null)) {
        const singleplayerButton = document.createElement('div');
        singleplayerButton.className = 'singleplayer-button';
        singleplayerButton.id = 'singleplayer-button';
        const multiplayerButton = document.createElement('div');
        multiplayerButton.className = 'multiplayer-button';
        multiplayerButton.id = 'multiplayer-button';
        const bg = document.getElementById('bg');
        bg.appendChild(multiplayerButton);
        const buttons = document.getElementById('buttons');
        bg.insertBefore(singleplayerButton, buttons);
        singleplayerButton.addEventListener("click", function () {
            selectGameMode = 'singleplayer';
            const removeSingleplayerButton = document.getElementById("singleplayer-button");
            removeSingleplayerButton.remove();
            const removeMultiplayerButton = document.getElementById("multiplayer-button");
            removeMultiplayerButton.remove();
        });
        multiplayerButton.addEventListener("click", function () {
            selectGameMode = 'multiplayer';
            const removeSingleplayerButton = document.getElementById("singleplayer-button");
            removeSingleplayerButton.remove();
            const removeMultiplayerButton = document.getElementById("multiplayer-button");
            removeMultiplayerButton.remove();
        });
    };
});
selectDifficultyButton.addEventListener("click", function () {
    if ((document.getElementById("easy-button") === null) && (document.getElementById("singleplayer-button") === null)) {
        const easyButton = document.createElement('div');
        const mediumButton = document.createElement('div');
        const hardButton = document.createElement('div');
        const impossibleButton = document.createElement('div');
        easyButton.className = 'easy-button';
        mediumButton.className = 'medium-button';
        hardButton.className = 'hard-button';
        impossibleButton.className = 'impossible-button';
        easyButton.id = 'easy-button';
        mediumButton.id = 'medium-button';
        hardButton.id = 'hard-button';
        impossibleButton.id = 'impossible-button';
        document.body.appendChild(hardButton);
        document.body.appendChild(impossibleButton);
        document.body.appendChild(easyButton);
        document.body.appendChild(mediumButton);
        easyButton.addEventListener("click", function () {
            selectDifficulty = 'easy';
            const removeEasyButton = document.getElementById("easy-button");
            removeEasyButton.remove();
            const removeMediumButton = document.getElementById("medium-button");
            removeMediumButton.remove();
            const removeHardButton = document.getElementById("hard-button");
            removeHardButton.remove();
            const removeImpossibleButton = document.getElementById("impossible-button");
            removeImpossibleButton.remove();
        });
        mediumButton.addEventListener("click", function () {
            selectDifficulty = 'medium';
            const removeEasyButton = document.getElementById("easy-button");
            removeEasyButton.remove();
            const removeMediumButton = document.getElementById("medium-button");
            removeMediumButton.remove();
            const removeHardButton = document.getElementById("hard-button");
            removeHardButton.remove();
            const removeImpossibleButton = document.getElementById("impossible-button");
            removeImpossibleButton.remove();
        });
        hardButton.addEventListener("click", function () {
            selectDifficulty = 'hard';
            const removeEasyButton = document.getElementById("easy-button");
            removeEasyButton.remove();
            const removeMediumButton = document.getElementById("medium-button");
            removeMediumButton.remove();
            const removeHardButton = document.getElementById("hard-button");
            removeHardButton.remove();
            const removeImpossibleButton = document.getElementById("impossible-button");
            removeImpossibleButton.remove();
        });
        impossibleButton.addEventListener("click", function () {
            selectDifficulty = 'impossible';
            const removeEasyButton = document.getElementById("easy-button");
            removeEasyButton.remove();
            const removeMediumButton = document.getElementById("medium-button");
            removeMediumButton.remove();
            const removeHardButton = document.getElementById("hard-button");
            removeHardButton.remove();
            const removeImpossibleButton = document.getElementById("impossible-button");
            removeImpossibleButton.remove();
        });
    };
});
selectHeroButton.addEventListener("click", function () {
    const bg = document.getElementById('bg');
    bg.remove();
    const newbg = document.createElement('div');
    newbg.className = 'newbg';
    newbg.id = 'newbg';
    const realbg = document.getElementById('black-bg');
    realbg.appendChild(newbg);
    const mage = document.createElement('div');
    mage.className = 'mage';
    mage.id = 'mage';
    newbg.appendChild(mage);
    const hunter = document.createElement('div');
    hunter.className = 'hunter';
    hunter.id = 'hunter';
    newbg.appendChild(hunter);
    const paladin = document.createElement('div');
    paladin.className = 'paladin';
    paladin.id = 'paladin';
    newbg.appendChild(paladin);
    const warlock = document.createElement('div');
    warlock.className = 'warlock';
    warlock.id = 'warlock';
    newbg.appendChild(warlock);
    hunter.addEventListener("click", function () {
        if ((document.getElementById("select-hero-button") === null)) {
            const hunterBig = document.createElement('div');
            hunterBig.className = 'hunter-selected';
            hunterBig.id = 'hunter-selected';
            newbg.appendChild(hunterBig);
            const selectHeroButton = document.createElement('div');
            selectHeroButton.className = 'select-hero-button';
            selectHeroButton.id = 'select-hero-button';
            newbg.appendChild(selectHeroButton);
            selectHeroButton.addEventListener("click", function () {
                selectHero = 'hunter';
                newbg.remove();
                realbg.appendChild(bg);
            });
        }
    });
    mage.addEventListener("click", function () {
        if ((document.getElementById("select-hero-button") === null)) {
            const mageBig = document.createElement('div');
            mageBig.className = 'mage-selected';
            mageBig.id = 'mage-selected';
            newbg.appendChild(mageBig);
            const selectHeroButton = document.createElement('div');
            selectHeroButton.className = 'select-hero-button';
            selectHeroButton.id = 'select-hero-button';
            newbg.appendChild(selectHeroButton);
            selectHeroButton.addEventListener("click", function () {
                selectHero = 'mage';
                newbg.remove();
                realbg.appendChild(bg);
            });
        }
    });
    paladin.addEventListener("click", function () {
        if ((document.getElementById("select-hero-button") === null)) {
            const paladinBig = document.createElement('div');
            paladinBig.className = 'paladin-selected';
            paladinBig.id = 'paladin-selected';
            newbg.appendChild(paladinBig);
            const selectHeroButton = document.createElement('div');
            selectHeroButton.className = 'select-hero-button';
            selectHeroButton.id = 'select-hero-button';
            newbg.appendChild(selectHeroButton);
            selectHeroButton.addEventListener("click", function () {
                selectHero = 'paladin';
                newbg.remove();
                realbg.appendChild(bg);
            });
        }
    });
    warlock.addEventListener("click", function () {
        if ((document.getElementById("select-hero-button") === null)) {
            const warlockBig = document.createElement('div');
            warlockBig.className = 'warlock-selected';
            warlockBig.id = 'warlock-selected';
            newbg.appendChild(warlockBig);
            const selectHeroButton = document.createElement('div');
            selectHeroButton.className = 'select-hero-button';
            selectHeroButton.id = 'select-hero-button';
            newbg.appendChild(selectHeroButton);
            selectHeroButton.addEventListener("click", function () {
                selectHero = 'warlock';
                newbg.remove();
                realbg.appendChild(bg);
            });
        }
    });
    const homeButton = document.createElement('div');
    homeButton.className = 'homeButton';
    homeButton.id = 'homeButton';
    newbg.appendChild(homeButton);
    homeButton.addEventListener("click", function () {
        newbg.remove();
        realbg.appendChild(bg);
    });
});
startGameButton.addEventListener("click", function () {
    var url;
    console.log(selectGameMode)
    if (selectGameMode === 'singleplayer') {
        url = 'arena?heroclass=' + encodeURIComponent(selectHero) +
            '&difficulty=' + encodeURIComponent(selectDifficulty);
        console.log(localStorage.getItem('id'),typeof encodeURIComponent(selectHero), "artem")
        socket.send(JSON.stringify({
                type: "create bot game",
                data : {
                    clientID: localStorage.getItem('id'),
                    hero: encodeURIComponent(selectHero),
                }
            })
        )
    } else {
        url = 'arena?heroclass=' + encodeURIComponent(selectHero);
        socket.send(JSON.stringify({
            type: "create game",
            data : {
                clientID: localStorage.getItem('id'),
                hero: encodeURIComponent(selectHero),
            }
        }))
    }

    socket.onmessage = event =>{
        const data = JSON.parse(event.data);
        console.log(data.type);
        console.log(data.data);

        setGame(ParseDataToGameTable(data.data))
        url += "&room="+ game.id
        console.log(url)

        window.location.href = url;
    }
});