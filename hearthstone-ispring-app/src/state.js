import { CardRecord } from "../models/CardModel.js"

const fireball = CardRecord({
    id: 1,
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

const cards = [fireball, waterball, golem]