import { GameTable, CardData, Player } from "./models.js";

import { game, setGame, stateMachine } from "./game.js"

export const socket = new WebSocket("ws://localhost:3000/ws");

socket.onmessage = function(event) {
    const message = JSON.parse(event.data);
    
    //console.log(message.data)
    //console.log(message.type)

    switch (message.type) {
        case "start game":
            console.log("start game")
            let game_ = ParseDataToGameTable(message.data)
            const cardsHand = document.getElementById('cards');
                for(const cardInHand of game_.player1.hand)
                {
                    console.log(cardInHand)
                    let newCardElement = document.createElement('div');
                    newCardElement.className = "cards__card cards__card_start";
                    newCardElement.style.width = '94px';
                    newCardElement.style.height = '135px';
                    newCardElement.id = `${cardInHand.cardID}`;
                    newCardElement.style.background = `url(../..${cardInHand.portrait})`;
                    newCardElement.style.backgroundImage = `url(../..${cardInHand.portrait})`
                    newCardElement.style.backgroundColor = 'red';
                    newCardElement.style.backgroundSize = `cover`;

                    const manaElement = document.createElement('span');
                    manaElement.className = "card__mana";
                    manaElement.textContent = cardInHand.mana;
                    newCardElement.appendChild(manaElement);
                    cardsHand.appendChild(newCardElement);
                }
            stateMachine.processEvent("start game");
            break;
        case "turn":
            console.log("turn")
            break;
        default :
            break;
    }
};

socket.onopen = () => {
    console.log('Соединение установлено');

    // Отправка сообщения на сервер
    socket.send('Привет, сервер!');
};

socket.onclose = (event) => {
    console.log('Соединение закрыто:', event.code, event.reason);
};

socket.onerror = (error) => {
    console.error('Ошибка соединения:', error);
};

function ParseDataToGameTable(data)
{
    return new GameTable(
        ParseDataToPlayer(data.Player1),
        ParseDataToPlayer(data.Player2),
        ParseDataToCards(data.History),
    )
}

function ParseDataToPlayer(data)
{
    return new Player(
        data.Name,
        ParseDataToCards(data.Hand),
        ParseDataToCards(data.Cards), 
        ParseDataToCards(data.Deck),
        data.Turn,
        data.HP,
        data.Def,
    )
}

function ParseDataToCard(data)
{
    return new CardData(
        data.Name,
        data.Portrait,
        data.CardID,
        data.Specification,
        data.Mana,
        data.Attack,
        data.Defense,
    );
}

function ParseDataToCards(data)
{
    let newCards = [];
    for(const card of data)
    {
        newCards.push(ParseDataToCard(card));
    }
    return newCards;
}