CREATE TABLE creature
(
    `creature_id`     INT NOT NULL AUTO_INCREMENT,
    `name`        VARCHAR(255) NOT NULL,
    `healthpoint` INT DEFAULT 0,
    `attack`      INT DEFAULT 0,
    `defense`     INT DEFAULT 1,
    `portrait`    VARCHAR(255) DEFAULT '',
    `specification` VARCHAR(255) DEFAULT '',
    `card_id`     INT,
    PRIMARY KEY (`creature_id`),
    FOREIGN KEY (card_id) REFERENCES deck(card_id)
) ENGINE = InnoDB
  CHARACTER SET = utf8mb4
  COLLATE utf8mb4_unicode_ci
;