package handlers

import (
	"affiliate/internal/database"
	"affiliate/internal/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

// GetConcerts godoc
// @Summary Get all concerts
// @Description ดึงข้อมูลคอนเสิร์ตทั้งหมด
// @Tags Concerts
// @Accept json
// @Produce json
// @Security BearerAuth
// @Success 200 {array} models.Concert
// @Failure 500 {object} ErrorResponse
// @Router /api/v1/external/concerts [get]
func GetConcerts(c *gin.Context) {
	rows, err := database.DB.Query("SELECT id, name, artist, location, date, description, price, image_url, detail_url, category FROM concerts")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Query failed"})
		return
	}
	defer rows.Close()

	var concerts []models.Concert
	for rows.Next() {
		var con models.Concert
		if err := rows.Scan(&con.ID, &con.Name, &con.Artist, &con.Location, &con.Date, &con.Description, &con.Price, &con.ImageURL, &con.DetailURL, &con.Category); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Row scan failed"})
			return
		}
		concerts = append(concerts, con)
	}

	c.JSON(http.StatusOK, concerts)
}
