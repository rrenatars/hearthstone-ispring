package database

import (
	"fmt"

	"github.com/jmoiron/sqlx"
	"github.com/rrenatars/hearthstone-ispring/internal/models"
)

type AuthMySQL struct {
	db *sqlx.DB
}

func NewAuthMySQL(db *sqlx.DB) *AuthMySQL {
	return &AuthMySQL{db: db}
}

func (r *AuthMySQL) CreateUser(user models.User) (int, error) {
	var id int
	query := fmt.Sprintf("INSERT INTO %s (name, username, password_hash) VALUES (?, ?, ?)", usersTable)

	result, err := r.db.Exec(query, user.Name, user.Username, user.Password)
	if err != nil {
		return 0, err
	}

	lastInsertID, err := result.LastInsertId()
	if err != nil {
		return 0, err
	}

	id = int(lastInsertID)
	return id, nil
}

func (r *AuthMySQL) GetUser(username, password string) (models.User, error) {
	var user models.User
	query := "SELECT id FROM users WHERE username=? AND password_hash=?"
	err := r.db.Get(&user, query, username, password)

	return user, err
}
