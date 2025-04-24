package routes

import (
	handlers "affiliate/internal/handler"
	middlewares "affiliate/internal/middleware"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine) {
	r.POST("/api/register", handlers.RegisterAffiliator)

	v1 := r.Group("/api/v1")
	v1.Use(
		middlewares.AuthMiddleware(),
		middlewares.LoggerMiddleware(),
		middlewares.RequestLoggerMiddleware(),
	)
	{
		v1.GET("/external/concerts", handlers.GetConcerts)
		v1.GET("/external/banners", handlers.GetBanner)
		v1.GET("/external/concerts/search", handlers.SearchConcerts)
		v1.POST("/logs/click", handlers.LogClick)
		v1.POST("/websites", handlers.AddWebsite)
		v1.GET("/websites", handlers.GetAffiliatorWebsites)
		v1.DELETE("/websites/:id", handlers.DeleteWebsite)
		v1.GET("/dashboard/sum-click", handlers.GetClickSummary)
	}
}
