package database

import (
	"fmt"

	"github.com/jmoiron/sqlx"
)

const (
	usersTable = "users"
)

type Config struct {
	Host     string
	Port     string
	Username string
	Password string
	DBName   string
	//SSLMode      string
	DbDriverName string
}

func OpenDB(cfg Config) (*sqlx.DB, error) {
	return sqlx.Open(cfg.DbDriverName, fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local",
		cfg.Username, cfg.Password, cfg.Host, cfg.Port, cfg.DBName))
}

func NewMySQLDB(cfg Config) (*sqlx.DB, error) {
	db, err := OpenDB(cfg)
	if err != nil {
		return nil, err
	}

	err = db.Ping()
	if err != nil {
		return nil, err
	}

	return db, nil
}
