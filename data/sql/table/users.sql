CREATE TABLE IF NOT EXISTS users
(
    `id`            INT          NOT NULL AUTO_INCREMENT,
    `name`          VARCHAR(255) NOT NULL,
    `username`      VARCHAR(255) NOT NULL,
    `password_hash` VARCHAR(255) NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB
  CHARACTER SET = utf8mb4
  COLLATE utf8mb4_unicode_ci;