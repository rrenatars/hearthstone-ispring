package rest

import (
	"encoding/json"
	"errors"
	"github.com/gin-gonic/gin"
	"io"
	"log"
	"net/http"
)

const (
	authorizationHeader = "Authorization"
	userCtx             = "userId"
)

type token struct {
	Token string `json:"token" binding:"required"`
}

func (h *Handler) userIdentity(c *gin.Context) {
	//header := c.GetHeader(authorizationHeader)
	//log.Println(header, "header")
	reqData, err := io.ReadAll(c.Request.Body)
	if err != nil {
		log.Println(err)
		return
	}

	var header token

	if err := json.Unmarshal(reqData, &header); err != nil {
		newErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	log.Println("HEADER", header)

	//if header == "" {
	//	newErrorResponse(c, http.StatusUnauthorized, "empty auth header")
	//	return
	//}

	//headerParts := strings.Split(header, " ")
	//if len(headerParts) != 2 || headerParts[0] != "Bearer" {
	//	newErrorResponse(c, http.StatusUnauthorized, "invalid auth header")
	//	return
	//}
	//
	//if len(headerParts[1]) == 0 {
	//	newErrorResponse(c, http.StatusUnauthorized, "token is empty")
	//	return
	//}
	//
	//userId, err := h.services.Authorization.ParseToken(headerParts[1])
	//if err != nil {
	//	newErrorResponse(c, http.StatusUnauthorized, err.Error())
	//	return
	//}
	//
	//// Установите userId в контексте
	//c.Set(userCtx, userId)
	//c.Next()
	log.Println(c)
}

func getUserId(c *gin.Context) (int, error) {
	log.Println(c)
	id, ok := c.Get(userCtx)
	if !ok {
		return 0, errors.New("user id not found")
	}

	idInt, ok := id.(int)
	if !ok {
		return 0, errors.New("user id is of invalid type")
	}
	log.Println(idInt)
	return idInt, nil
}
