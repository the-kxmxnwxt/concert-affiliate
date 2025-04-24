package handlers

import (
	"affiliate/internal/config"
	"affiliate/internal/database"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

func RegisterAffiliator(c *gin.Context) {
	// ดึง JWT จาก Authorization Header
	authHeader := c.GetHeader("Authorization")
	if authHeader == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header missing"})
		return
	}

	tokenString := strings.TrimPrefix(authHeader, "Bearer ")
	if tokenString == authHeader {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token format"})
		return
	}

	// แกะ JWT
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		return jwt.ParseRSAPublicKeyFromPEM([]byte(config.KeycloakPublicKey)) // หรือ middlewares
	})
	if err != nil || !token.Valid {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
		return
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid claims"})
		return
	}

	// ดึงข้อมูลจาก claims
	email, _ := claims["email"].(string)
	name, _ := claims["name"].(string)
	sub, _ := claims["sub"].(string) // user ID จาก Keycloak

	// ตรวจสอบว่ามี affiliator นี้ใน DB แล้วหรือยัง
	var exists bool
	checkQuery := `SELECT EXISTS (SELECT 1 FROM affiliators WHERE keycloak_id = $1)`
	err = database.DB.QueryRow(checkQuery, sub).Scan(&exists)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	if !exists {
		// ลงทะเบียน affiliator ใหม่
		insertQuery := `INSERT INTO affiliators (keycloak_id, name, email) VALUES ($1, $2, $3)`
		_, err := database.DB.Exec(insertQuery, sub, name, email)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Database insert error"})
			return
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "registered via Keycloak",
		"name":    name,
		"email":   email,
	})
}
