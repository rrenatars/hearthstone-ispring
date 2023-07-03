import React from 'react';
import PropTypes from 'prop-types';
import { CardRecord } from '../models/CardModel.js';

const Card = ({ card }) => {
    const { name, mana, attack, defense, portrait } = card;
    const cardClass = 'card';

    return (
        <div className={cardClass}>{name}</div>
    );
};

Card.propTypes = {
    card: PropTypes.instanceOf(CardRecord).isRequired,
};

export default Card;