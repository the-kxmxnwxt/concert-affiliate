package handlers

import (
	"affiliate/internal/database"
	"affiliate/internal/models"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

func AddWebsite(c *gin.Context) {
	var input models.Website
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
	log.Println("Keycloak ID:", keycloakID)

	var affiliatorUUID string
	err := database.DB.QueryRow(
		"SELECT id FROM affiliators WHERE keycloak_id = $1",
		keycloakID,
	).Scan(&affiliatorUUID)
	if err != nil {
		log.Println("Failed to find affiliator UUID:", err)
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Affiliator not found"})
		return
	}

	query := `INSERT INTO referrer_sites (affiliator_id, site_url) VALUES ($1, $2)`
	_, err = database.DB.Exec(query, affiliatorUUID, input.WebsiteURL)
	if err != nil {
		log.Println("Failed to insert website:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "website registered"})
}
