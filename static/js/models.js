export class CardData {
    /**
     * @param {string} name
     * @param {string} portrait
     * @param {string} cardID
     * @param {string} specification
     * @param {number} hp
     * @param {number} mana
     * @param {number} attack
     * @param {number} defense
     */
    constructor(name, portrait, cardID, specification, hp, mana, attack, defense) {
        this.name = name;
        this.portrait = portrait;
        this.cardID = cardID;
        this.specification = specification;
        this.hp = hp;
        this.mana = mana;
        this.attack = attack;
        this.defense = defense;
    }
}

export class Player {
    /**
     * @param {string} name
     * @param {Array<CardData>} hand
     * @param {Array<CardData>} cards
     * @param {Array<CardData>} deck
     * @param {boolean} turn
     * @param {number} HP
     * @param {number} Def
     */
    constructor(name, hand, cards, deck, turn, HP, Def) {
        this.name = name;
        this.hand = hand;
        this.cards = cards;
        this.deck = deck;
        this.turn = turn;
        this.HP = HP;
        this.Def = Def;
    }
}

export class GameTable {
    /**
     * @param {Player} player1
     * @param {Player} player2
     * @param {Array<CardData>} history
     * @param {string} id
     */
    constructor(player1, player2, history, id) {
        this.player1 = player1;
        this.player2 = player2;
        this.history = history;
        this.id = id
    }
}




