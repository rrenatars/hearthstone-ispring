USE hearthstone;

CREATE TABLE IF NOT EXISTS deck
(
    `card_id`       INT          NOT NULL AUTO_INCREMENT,
    `name`          VARCHAR(255) NOT NULL,
    `mana`          INT          NOT NULL,
    `healthpoint`   INT          DEFAULT 0,
    `attack`        INT          DEFAULT 0,
    `defense`       INT          DEFAULT 1,
    `portrait`      VARCHAR(255) DEFAULT '',
    `specification` VARCHAR(255) DEFAULT '',
    PRIMARY KEY (`card_id`)
) ENGINE = InnoDB
  CHARACTER SET = utf8mb4
  COLLATE utf8mb4_unicode_ci;

INSERT INTO deck (name, mana, healthpoint, attack, portrait)
VALUES ('boulderfist-ogre', '6', '7', '6', '/static/images/cards-in-hand/boulderfist-ogre.png'),
       ('rage-amgam', '3', '5', '1', '/static/images/cards-in-hand/rage-amgam.png'),
       ('lost-longleg', '4', '4', '5', '/static/images/cards-in-hand/lost-longleg.png'),
       ('arena-fighter', '5', '6', '5', '/static/images/cards-in-hand/arena-fighter.png'),
       ('wisp', '0', '1', '1', '/static/images/cards-in-hand/wisp.png'),
       ('arcane-servant', '2', '3', '2', '/static/images/cards-in-hand/arcane-servant.png'),
       ('dire-mole', '1', '3', '1', '/static/images/cards-in-hand/dire-mole.png');

INSERT INTO deck (name, mana, healthpoint, attack, portrait, specification)
VALUES ('pompous-actor', '2', '2', '3', '/static/images/cards-in-hand/pompous-actor.png', 'taunt'),
       ('boar-rocktusk', '1', '1', '1', '/static/images/cards-in-hand/boar-rocktusk.png', 'charge'),
       ('scarlet-crusader', '3', '1', '3', '/static/images/cards-in-hand/scarlet-crusader.png', 'divine-shield'),
       ('divine-fury', '4', '1', '5', '/static/images/cards-in-hand/divine-fury.png', 'divine-shield'),
       ('goblin-bodyguard', '5', '4', '5', '/static/images/cards-in-hand/goblin-bodyguard.png', 'taunt'),
       ('living-monument', '10', '10', '10', '/static/images/cards-in-hand/living-monument.png', 'taunt'),
       ('mexna', '6', '8', '2', '/static/images/cards-in-hand/mexna.png', 'poisonous'),
       ('evil-mocker', '4', '4', '5', '/static/images/cards-in-hand/evil-mocker.png', 'taunt'),
       ('sharptooth-redgill', '2', '1', '3', '/static/images/cards-in-hand/sharptooth-redgill.png', 'rush'),
       ('wolf-rider', '3', '1', '3', '/static/images/cards-in-hand/wolf-rider.png', 'charge'),
       ('sleeping-dragon', '9', '12', '4', '/static/images/cards-in-hand/sleeping-dragon.png', 'taunt'),
       ('goldshire-soldier', '1', '2', '1', '/static/images/cards-in-hand/goldshire-soldier.png', 'taunt'),
       ('strong-shoveler', '9', '9', '9', '/static/images/cards-in-hand/strong-shoveler.png', 'rush'),
       ('grizzly-steelmech', '3', '3', '3', '/static/images/cards-in-hand/grizzly-steelmech.png', 'taunt'),
       ('power-tank', '8', '7', '7', '/static/images/cards-in-hand/power-tank.png', 'divine-shield'),
       ('wriggling-tentacles', '3', '4', '2', '/static/images/cards-in-hand/wriggling-tentacles.png', 'taunt'),
       ('bluegill-warrior', '2', '1', '2', '/static/images/cards-in-hand/bluegill-warrior.png', 'rush'),
       ('frostwolf-fighter', '2', '2', '2', '/static/images/cards-in-hand/frostwolf-fighter.png', 'taunt'),
       ('stormwind-knight', '4', '5', '2', '/static/images/cards-in-hand/stormwind-knight.png', 'charge'),
       ('emperator-cobra', '3', '3', '2', '/static/images/cards-in-hand/emperator-cobra.png', 'poisonous'),
       ('rock-rager', '2', '1', '5', '/static/images/cards-in-hand/rock-rager.png', 'taunt'),
       ('argent-squire', '1', '1', '1', '/static/images/cards-in-hand/argent-squire.png', 'divine-shield'),
       ('shieldbearer', '1', '4', '0', '/static/images/cards-in-hand/shieldbearer.png', 'taunt');