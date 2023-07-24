USE hearthstone;

CREATE TABLE IF NOT EXISTS deck (
    `card_id` INT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `mana` INT NOT NULL,
    `healthpoint` INT DEFAULT 0,
    `attack` INT DEFAULT 0,
    `defense` INT DEFAULT 1,
    `portrait` VARCHAR(255) DEFAULT '',
    `specification` VARCHAR(255) DEFAULT '',
    PRIMARY KEY (`card_id`)
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE utf8mb4_unicode_ci;

INSERT INTO deck (name, mana, healthpoint, attack, portrait)
VALUES
    ('Boulderfist Ogre', '6', '7', '6', '/static/images/cards-in-hand/boulderfist-ogre.png'),
    ('Scarlet Crusader', '3', '1', '3', '/static/images/cards-in-hand/scarlet-crusader.png'),
    ('Rage Amgam', '3', '5', '1', '/static/images/cards-in-hand/rage-amgam.png'),
    ('Divine Fury', '4', '1', '5', '/static/images/cards-in-hand/divine-fury.png'),
    ('Power Tank', '8', '7', '7', '/static/images/cards-in-hand/power-tank.png'),
    ('Lost Longleg', '4', '4', '5', '/static/images/cards-in-hand/lost-longleg.png'),
    ('Arena Fighter', '5', '2', '2', '/static/images/cards-in-hand/arena-fighter.png');

INSERT INTO deck (name, mana, healthpoint, attack, portrait, specification)
VALUES
    ('Pompous Actor', '2', '2', '3', '/static/images/cards-in-hand/pompous-actor.png', 'provocation'),
    ('Goblin Bodyguard', '5', '4', '5', '/static/images/cards-in-hand/goblin-bodyguard.png', 'provocation'),
    ('Living Monument', '10', '10', '10', '/static/images/cards-in-hand/living-monument.png', 'provocation'),
    ('Evil Mocker', '4', '4', '5', '/static/images/cards-in-hand/evil-mocker.png', 'provocation'),
    ('Arbiter Moshogg', '8', '14', '2', '/static/images/cards-in-hand/arbiter-moshogg.png', 'provocation'),
    ('Sleeping Dragon', '9', '12', '4', '/static/images/cards-in-hand/sleeping-dragon.png', 'provocation'),
    ('Grizzly Steelmech', '3', '3', '3', '/static/images/cards-in-hand/grizzly-steelmech.png', 'provocation'),
    ('Wriggling Tentacles', '3', '4', '2', '/static/images/cards-in-hand/wriggling-tentacles.png', 'provocation'),
    ('Frostwolf Fighter', '2', '2', '2', '/static/images/cards-in-hand/frostwolf-fighter.png', 'provocation'),
    ('Goldshire Soldier', '1', '2', '1', '/static/images/cards-in-hand/goldshire-soldier.png', 'provocation'),
    ('Mexna', '6', '8', '2', '/static/images/cards-in-hand/mexna.png', 'poison'),
    ('Stoneskin Basilisk', '3', '1', '1', '/static/images/cards-in-hand/stoneskin-basilisk.png', 'poison'),
    ('Boar Rocktusk', '1', '1', '1', '/static/images/cards-in-hand/boar-rocktusk.png', 'burst'),
    ('Wolf Rider', '3', '1', '3', '/static/images/cards-in-hand/wolf-rider.png', 'burst'),
    ('Sharptooth Redgill', '2', '1', '3', '/static/images/cards-in-hand/sharptooth-redgill.png', 'rush'),
    ('Strong Shoveler', '9', '9', '9', '/static/images/cards-in-hand/strong-shoveler.png', 'rush'),
    ('Bluegill Warrior', '2', '1', '2', '/static/images/cards-in-hand/bluegill-warrior.png', 'rush');

