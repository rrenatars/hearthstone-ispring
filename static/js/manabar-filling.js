export function manabarFilling(mana, manaElement, startManaMove) {
    const arrayOfCrystals = [];

    if (manaElement.id === 'MyMana') {
        console.log(manaElement.id)
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