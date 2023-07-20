package services

import (
	"github.com/rrenatars/hearthstone-ispring/internal/database"
	"github.com/rrenatars/hearthstone-ispring/internal/models"
)

type Authorization interface {
	CreateUser(user models.User) (int, error)
	GenerateToken(username, password string) (string, error)
	ParseToken(token string) (int, error)
}

type Service struct {
	Authorization
}

func NewService(repos *database.Repository) *Service {
	return &Service{
		Authorization: NewAuthService(repos.Authorization),
	}
}
