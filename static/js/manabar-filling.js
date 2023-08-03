export function manabarFilling(mana, manaElement, startManaMove) {
    const arrayOfCrystals = [];

    if (mana >= 10) {
        mana = 10
    }
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