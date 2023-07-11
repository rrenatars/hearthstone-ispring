USE hearthstone;
CREATE TABLE  IF NOT EXISTS deck 
(
    `card_id`     INT NOT NULL AUTO_INCREMENT,
    `name`        VARCHAR(255) NOT NULL,
    `mana`        INT NOT NULL,
    `healthpoint` INT DEFAULT 0,
    `attack`      INT DEFAULT 0,
    `defense`     INT DEFAULT 1,
    `portrait`    VARCHAR(255) DEFAULT '',
    `specification` VARCHAR(255) DEFAULT '',
    PRIMARY KEY (`card_id`)
) ENGINE = InnoDB
  CHARACTER SET = utf8mb4
  COLLATE utf8mb4_unicode_ci
;

INSERT INTO deck (name, mana, healthpoint, attack, portrait)
VALUES
    (
     'Fireball', '4', '4', '4', '/static/images/cards-in-hand/card-sprite.png'
    );

INSERT INTO deck (name, mana, healthpoint, attack, portrait)
VALUES
    ('Boulderfist Ogre', '6', '7', '6', '/static/images/cards-in-hand/Boulderfist Ogre.png'),
    ('Pompous Actor', '2', '2', '3', '/static/images/cards-in-hand/Pompous Actor.png'),
    ('Stoneskin Basilisk', '3', '1', '1', '/static/images/cards-in-hand/Stoneskin Basilisk.png'),
    ('Boar Rocktusk', '1', '1', '1', '/static/images/cards-in-hand/Boar Rocktusk.png'),
    ('Jablin Catcher', '2', '3', '2', '/static/images/cards-in-hand/Jablin Catcher.png'),
    ('Scarlet Crusader', '3', '1', '3', '/static/images/cards-in-hand/Scarlet Crusader.png'),
    ('Rage Amgam', '3', '5', '1', '/static/images/cards-in-hand/Rage Amgam.png'),
    ('Divine Fury', '4', '1', '5', '/static/images/cards-in-hand/Divine Fury.png'),
    ('Goblin Bodyguard', '5', '4', '5', '/static/images/cards-in-hand/Goblin Bodyguard.png'),
    ('Hippogriff', '4', '6', '2', '/static/images/cards-in-hand/Hippogriff.png'),
    ('Living Monument', '10', '10', '10', '/static/images/cards-in-hand/Living Monument.png'),
    ('Mexna', '6', '8', '2', '/static/images/cards-in-hand/Mexna.png'),
    ('Evil Mocker', '4', '4', '5', '/static/images/cards-in-hand/Evil Mocker.png'),
    ('Sharptooth Redgill', '2', '1', '3', '/static/images/cards-in-hand/Sharptooth Redgill.png'),
    ('Arbiter Moshogg', '8', '14', '2', '/static/images/cards-in-hand/Arbiter Moshogg.png'),
    ('Wolf Rider', '3', '1', '3', '/static/images/cards-in-hand/Wolf Rider.png'),
    ('Vergen Scout', '1', '2', '1', '/static/images/cards-in-hand/Vergen Scout.png'),
    ('Sleeping Dragon', '9', '12', '4', '/static/images/cards-in-hand/Sleeping Dragon.png'),
    ('Smart Gastropod', '2', '1', '2', '/static/images/cards-in-hand/Smart Gastropod.png'),
    ('Goldshire Soldier', '1', '2', '1', '/static/images/cards-in-hand/Goldshire Soldier.png'),
    ('Strong Shoveler', '9', '9', '9', '/static/images/cards-in-hand/Strong Shoveler.png'),
    ('Grizzly Steelmech', '3', '3', '3', '/static/images/cards-in-hand/Grizzly Steelmech.png'),
    ('Power Tank', '8', '7', '7', '/static/images/cards-in-hand/Power Tank.png'),
    ('Wriggling Tentacles', '3', '4', '2', '/static/images/cards-in-hand/Wriggling Tentacles.png'),
    ('Bluegill Warrior', '2', '1', '2', '/static/images/cards-in-hand/Bluegill Warrior.png'),
    ('Giant Wasp', '3', '2', '2', '/static/images/cards-in-hand/Giant Wasp.png'),
    ('Lost Longleg', '4', '4', '5', '/static/images/cards-in-hand/Lost Longleg.png'),
    ('Frostwolf Fighter', '2', '2', '2', '/static/images/cards-in-hand/Frostwolf Fighter.png'),
    ('Warped Worgen', '2', '3', '1', '/static/images/cards-in-hand/Warped Worgen.png');