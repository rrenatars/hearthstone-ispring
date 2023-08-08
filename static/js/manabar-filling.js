export function manabarFilling(mana, manaElement, startManaMove) {
    const arrayOfCrystals = [];

    if (startManaMove >= 10) {
        startManaMove = 10
    }
    if (manaElement.id === 'MyMana') {
        const manabar = document.getElementById('Manabar');

        for (let i = 1; i <= mana; i++) {
            const manaCrystalImage = document.createElement('img');
            manaCrystalImage.src = '../static/images/field/mana.png';
            manaCrystalImage.setAttribute('class', 'manabar__crystall');
            arrayOfCrystals.push(manaCrystalImage);
        }
        manabar.replaceChildren(...arrayOfCrystals);
    }

    manaElement.textContent = mana + '/' + startManaMove;
}

export function manabarFillingHover(cardManaValue) {
    const manaElement = document.getElementById("MyMana")
    const manabar = document.getElementById('Manabar');
    const playerManaValue = parseInt(manaElement.innerHTML)

    const arrayOfCrystals = []
    const emptyArray = []

    for (let i = 1; i <= (playerManaValue - cardManaValue); i++) {
        const manaCrystalImage = document.createElement('img');
        manaCrystalImage.src = '../static/images/field/mana.png';
        manaCrystalImage.setAttribute('class', 'manabar__crystall');
        arrayOfCrystals.push(manaCrystalImage)
    }

    for (let i = playerManaValue - cardManaValue + 1; i <= playerManaValue; i++) {
        const manaCrystalImage = document.createElement('img');
        manaCrystalImage.src = '../static/images/field/mana.png';
        manaCrystalImage.setAttribute('class', 'manabar__crystall_bright');
        arrayOfCrystals.push(manaCrystalImage)
    }
    manabar.replaceChildren(...emptyArray)

    for (let i = 0; arrayOfCrystals[i].classList.contains("manabar__crystall"); i++) {
        manabar.append(arrayOfCrystals[i])
    }

    for (let i = playerManaValue - cardManaValue; i < playerManaValue; i++) {
        // setTimeout(function() {
        manabar.append(arrayOfCrystals[i]);
        // }, 100);
    }
}