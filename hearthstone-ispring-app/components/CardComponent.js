import React, { PropTypes } from 'react';
import { CardRecord } from "../models/CardModel.js"

const Card = ({ card }) => {
    const { name, mana, attack, defense, portrait } = card;

    return (
        <div className={cardClass}></div>
    );
};

Card.propTypes = {
    card: PropTypes.instanceOf(CardRecord).isRequired,
};
