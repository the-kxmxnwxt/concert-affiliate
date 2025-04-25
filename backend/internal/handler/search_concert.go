package handlers

import (
	"affiliate/internal/database"
	"affiliate/internal/models"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

// SearchConcerts godoc
// @Summary Search concerts by name
// @Description ค้นหาคอนเสิร์ตโดยระบุชื่อบางส่วน
// @Tags Concerts
// @Accept json
// @Produce json
// @Security BearerAuth
// @Param q query string true "Search keyword"
// @Success 200 {array} models.Concert
// @Failure 400 {object} ErrorResponse
// @Failure 500 {object} ErrorResponse
// @Router /api/v1/external/concerts/search [get]
func SearchConcerts(c *gin.Context) {
	query := c.Query("q")
	if strings.TrimSpace(query) == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Missing search query"})
		return
	}

	rows, err := database.DB.Query(`
		SELECT id, name, artist, location, date, description, price, image_url, detail_url, category
		FROM concerts
		WHERE LOWER(name) LIKE LOWER($1)
	`, "%"+query+"%")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database query failed"})
		return
	}
	defer rows.Close()

	var results []models.Concert
	for rows.Next() {
		var con models.Concert
		err := rows.Scan(&con.ID, &con.Name, &con.Artist, &con.Location, &con.Date,
			&con.Description, &con.Price, &con.ImageURL, &con.DetailURL, &con.Category)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to scan concert row"})
			return
		}
		results = append(results, con)
	}

	c.JSON(http.StatusOK, results)
}
