// main.go
package main

import (
	_ "affiliate/docs" // ให้ Swag สร้างเอกสารใน Folder docs โดยอัตโนมัติ

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"

	"affiliate/internal/config"
	"affiliate/internal/database"
	"affiliate/internal/routes"
)

// @title Affiliate Concert Service API
// @version 1.0
// @description This is the API documentation for the Affiliate Concert Service.
// @host localhost:8080
// @BasePath /
// @schemes http

// @securityDefinitions.apikey BearerAuth
// @in header
// @name Authorization
func main() {
	_ = godotenv.Load()
	cfg := config.LoadConfig()
	database.ConnectDB(cfg)

	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
		AllowHeaders:     []string{"Authorization", "Content-Type"},
		AllowCredentials: true,
	}))

	r.GET("/docs/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))
	routes.SetupRoutes(r)

	r.Run(":" + cfg.APIPort)
}
