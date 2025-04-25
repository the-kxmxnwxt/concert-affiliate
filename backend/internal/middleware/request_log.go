package middlewares

import (
	handlers "affiliate/internal/handler"

	"github.com/gin-gonic/gin"
)

func RequestLoggerMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		affiliatorID := c.GetHeader("X-Affiliator-ID")
		websiteURL := c.Request.Referer() // or pass explicitly

		handlers.LogRequest(c, affiliatorID, websiteURL)
		c.Next()
	}
}
