package middlewares

import (
	"log"
	"time"

	"github.com/gin-gonic/gin"
)

func LoggerMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		start := time.Now()
		c.Next()
		log.Printf("%s - [%s] %s %d (%s)",
			c.ClientIP(),
			start.Format(time.RFC1123),
			c.Request.Method+" "+c.Request.URL.Path,
			c.Writer.Status(),
			time.Since(start),
		)
	}
}
