// handlers/delete_website.go
package handlers

import (
	"affiliate/internal/database"
	"net/http"

	"github.com/gin-gonic/gin"
)

func DeleteWebsite(c *gin.Context) {
	affID, exists := c.Get("affiliatorID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	websiteID := c.Param("id")
	if websiteID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Missing website ID"})
		return
	}

	query := `DELETE FROM referrer_sites WHERE id = $1 AND affiliator_id = (
		SELECT id FROM affiliators WHERE keycloak_id = $2
	)`
	_, err := database.DB.Exec(query, websiteID, affID.(string))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete website"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Website deleted"})
}
