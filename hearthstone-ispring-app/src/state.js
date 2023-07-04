import {CardRecord} from "./models/CardModel.js"
import {PlayerRecord} from "./models/PlayerModel";

const fireball = CardRecord({
    id: 3,
    name: 'Fireball',
    mana: 4,
});

const waterball = CardRecord({
    id: 2,
    name: 'Waterball',
    mana: 4,
});

const golem = CardRecord({
    id: 1,
    name: 'Golem',
    mana: 4,
});

const player1= PlayerRecord({
   id: 1,
   name: 'Player1',
   mana: 10,
});

export const cards = [fireball, waterball, golem]
export const player = player1