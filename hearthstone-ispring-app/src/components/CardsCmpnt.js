import React from "react";
import PropTypes from "prop-types";
import {CardRecord} from "../models/CardModel";
import Card from "./CardComponent"

const Cards = ({cards}) => {
    return (
        <div className="cards">
            {cards.map((card) => (
                <Card card={card}></Card>
            ))}
        </div>
    );
};

Cards.propTypes = {
    cards: PropTypes.arrayOf(PropTypes.instanceOf(CardRecord)).isRequired,
};

export default Cards;