import React from 'react';
import PropTypes from 'prop-types';
import {PlayerRecord} from '../models/PlayerModel.js';

const Player = ({player}) => {
    const {name, mana, defense, portrait} = player;
    const playerClass = 'player';

    return (
        <div className={playerClass}>
            {name} Mana: {mana}
        </div>
    );
};

Player.propTypes = {
    card: PropTypes.instanceOf(PlayerRecord).isRequired,
};

export default Player;