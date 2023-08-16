import {heroPowerEnableToAttack} from "./enable.js";

export function reloadHeroPower(gamePlayer, enemyGamePlayer) {
    const selectedHeroElement = document.getElementById('selectedHero');
    const selectedHeroPowerElement = document.getElementById('heropower');
    const opponentHeroElement = document.getElementById('opponenthero');

    selectedHeroElement.style.backgroundImage = 'url(../static/images/field/' + gamePlayer.hero + '.png)';
    if ((!gamePlayer.heroTurn)) {
        selectedHeroPowerElement.style.backgroundImage = 'url(../static/images/field/' + gamePlayer.hero + '-power.png)';
        heroPowerEnableToAttack(gamePlayer.Mana, selectedHeroPowerElement)
    } else {
        selectedHeroPowerElement.style.backgroundImage = 'url(../static/images/field/used-power.png)';
        selectedHeroPowerElement.classList.remove("cards__card_enable-to-drag")
    }
    opponentHeroElement.style.backgroundImage = 'url(../static/images/field/' + enemyGamePlayer.hero + '.png)'
}