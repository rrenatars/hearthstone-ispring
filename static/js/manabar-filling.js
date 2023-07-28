export function manabarFilling(mana, manaElement) {
    const arrayOfCrystals = [];

    const manabar = document.getElementById('Manabar');

    for (let i = 1; i <= mana; i++) {
        const manaCrystalImage = document.createElement('img');
        manaCrystalImage.src = '../static/images/field/mana.png';
        manaCrystalImage.setAttribute('class', 'manabar__crystall');
        arrayOfCrystals.push(manaCrystalImage);
    }

    manaElement.textContent = mana + '/10';
    manabar.replaceChildren(...arrayOfCrystals);
}