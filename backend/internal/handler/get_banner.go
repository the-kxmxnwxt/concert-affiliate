package handlers

import (
	"affiliate/internal/database"
	"affiliate/internal/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

type ErrorResponse struct {
	Message string `json:"message"`
}

// GetBanner godoc
// @Summary Get all banners
// @Description ดึงข้อมูลแบนเนอร์ทั้งหมด
// @Tags Banners
// @Accept json
// @Produce json
// @Security BearerAuth
// @Success 200 {array} models.Banner
// @Failure 500 {object} ErrorResponse
// @Router /api/v1/external/banners [get]
func GetBanner(c *gin.Context) {
	rows, err := database.DB.Query("SELECT id, image_url, link FROM banners")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Query failed"})
		return
	}
	defer rows.Close()

	var banners []models.Banner
	for rows.Next() {
		var ban models.Banner
		if err := rows.Scan(&ban.ID, &ban.ImageURL, &ban.Link); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Row scan failed"})
			return
		}
		banners = append(banners, ban)
	}

	c.JSON(http.StatusOK, banners)
}
