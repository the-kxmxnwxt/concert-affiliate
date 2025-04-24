package handlers

import (
	"affiliate/internal/database"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetClickSummary(c *gin.Context) {
	affIDVal, exists := c.Get("affiliatorID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	keycloakID := affIDVal.(string)

	var affiliatorUUID string
	err := database.DB.QueryRow(
		"SELECT id FROM affiliators WHERE keycloak_id = $1", keycloakID,
	).Scan(&affiliatorUUID)

	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Affiliator not found"})
		return
	}

	rows, err := database.DB.Query(`
		SELECT concerts.name, COUNT(c.id), MAX(c.clicked_at)
		FROM click_logs c
		JOIN concerts ON concerts.id = c.concert_id
		WHERE c.affiliator_id = $1
		GROUP BY concerts.name
		ORDER BY COUNT(c.id) DESC
	`, affiliatorUUID)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Query failed"})
		return
	}
	defer rows.Close()

	var result []map[string]interface{}
	for rows.Next() {
		var name string
		var count int
		var lastClick string
		rows.Scan(&name, &count, &lastClick)

		result = append(result, gin.H{
			"name":        name,
			"click_count": count,
			"last_click":  lastClick,
		})
	}

	c.JSON(http.StatusOK, result)
}
