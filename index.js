const collisionbox = document.getElementById("collisionbox");

function createManaCrystal() {
    const manacontainer = document.getElementById("manacontainer");
    const manacrystal = document.createElement('div');
    manacrystal.classList.add("manabox");
    manacontainer.appendChild(manacrystal);
  }