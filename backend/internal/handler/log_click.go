package handlers

import (
	"affiliate/internal/database"
	"affiliate/internal/models"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

func LogClick(c *gin.Context) {
	var input models.ClickLog
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	keycloakIDVal, exists := c.Get("affiliatorID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "No affiliator ID from token"})
		return
	}
	keycloakID := keycloakIDVal.(string)

	var affiliatorUUID string
	err := database.DB.QueryRow(
		"SELECT id FROM affiliators WHERE keycloak_id = $1",
		keycloakID,
	).Scan(&affiliatorUUID)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Affiliator not found"})
		return
	}

	// บันทึก log
	query := `INSERT INTO click_logs (affiliator_id, website_url, concert_id) VALUES ($1, $2, $3)`
	_, err = database.DB.Exec(query, affiliatorUUID, input.WebsiteURL, input.ConcertID)
	if err != nil {
		log.Println("Failed to insert click log:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "click logged"})
}
