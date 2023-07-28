CREATE TABLE creature (
                          `creature_id` INT NOT NULL AUTO_INCREMENT,
                          `name` VARCHAR(255) NOT NULL,
                          `healthpoint` INT DEFAULT 0,
                          `mana` INT DEFAULT 0,
                          `attack` INT DEFAULT 0,
                          `defense` INT DEFAULT 1,
                          `portrait` VARCHAR(255) DEFAULT '',
                          `specification` VARCHAR(255) DEFAULT '',
                          `card_id` INT,
                          PRIMARY KEY (`creature_id`),
                          FOREIGN KEY (card_id) REFERENCES deck(card_id)
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE utf8mb4_unicode_ci;

INSERT INTO creature (name, mana, healthpoint, attack, portrait)
VALUES
    ('Boulderfist Ogre', '6', '7', '6', '/static/images/creatures/boulderfist-ogre.png'),
    ('Rage Amgam', '3', '5', '1', '/static/images/creatures/rage-amgam.png'),
    ('Lost Longleg', '4', '4', '5', '/static/images/creatures/lost-longleg.png'),
    ('Arena Fighter', '5', '6', '5', '/static/images/creatures/arena-fighter.png'),
    ('Wisp', '0', '1', '1', '/static/images/creatures/wisp.png'),
    ('Arcane Servant', '2', '3', '2', '/static/images/creatures/arcane-servant.png'),
    ('Dire Mole', '1', '3', '1', '/static/images/creatures/dire-mole.png');

INSERT INTO creature (name, mana, healthpoint, attack, portrait, specification)
VALUES
    ('Pompous Actor', '2', '2', '3', '/static/images/creatures/pompous-actor.png', 'taunt'),
    ('Boar Rocktusk', '1', '1', '1', '/static/images/creatures/boar-rocktusk.png', 'charge'),
    ('Scarlet Crusader', '3', '1', '3', '/static/images/creatures/scarlet-crusader.png', 'divine-shield'),
    ('Divine Fury', '4', '1', '5', '/static/images/creatures/divine-fury.png', 'divine-shield'),
    ('Goblin Bodyguard', '5', '4', '5', '/static/images/creatures/goblin-bodyguard.png', 'taunt'),
    ('Living Monument', '10', '10', '10', '/static/images/creatures/living-monument.png', 'taunt'),
    ('Mexna', '6', '8', '2', '/static/images/creatures/mexna.png', 'poisonous'),
    ('Evil Mocker', '4', '4', '5', '/static/images/creatures/evil-mocker.png', 'taunt'),
    ('Sharptooth Redgill', '2', '1', '3', '/static/images/creatures/sharptooth-redgill.png', 'rush'),
    ('Wolf Rider', '3', '1', '3', '/static/images/creatures/wolf-rider.png', 'charge'),
    ('Sleeping Dragon', '9', '12', '4', '/static/images/creatures/sleeping-dragon.png', 'taunt'),
    ('Goldshire Soldier', '1', '2', '1', '/static/images/creatures/goldshire-soldier.png', 'taunt'),
    ('Strong Shoveler', '9', '9', '9', '/static/images/creatures/strong-shoveler.png', 'rush'),
    ('Grizzly Steelmech', '3', '3', '3', '/static/images/creatures/grizzly-steelmech.png', 'taunt'),
    ('Power Tank', '8', '7', '7', '/static/images/creatures/power-tank.png', 'divine-shield'),
    ('Wriggling Tentacles', '3', '4', '2', '/static/images/creatures/wriggling-tentacles.png', 'taunt'),
    ('Bluegill Warrior', '2', '1', '2', '/static/images/creatures/bluegill-warrior.png', 'rush'),
    ('Frostwolf Fighter', '2', '2', '2', '/static/images/creatures/frostwolf-fighter.png', 'taunt'),
    ('Stormwind Knight', '4', '5', '2', '/static/images/creatures/stormwind-knight.png', 'charge'),
    ('Emperor Cobra', '3', '3', '2', '/static/images/creatures/emperor-cobra.png', 'poisonous'),
    ('Rock Rager', '2', '1', '5', '/static/images/creatures/rock-rager.png', 'taunt'),
    ('Argent Squire', '1', '1', '1', '/static/images/creatures/argent-squire.png', 'divine-shield'),
    ('Shieldbearer', '1', '4', '0', '/static/images/creatures/shieldbearer.png', 'taunt');