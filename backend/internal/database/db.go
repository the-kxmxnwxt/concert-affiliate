package database

import (
	"database/sql"
	"fmt"
	"log"

	"affiliate/internal/config"

	_ "github.com/lib/pq"
)

var DB *sql.DB

func ConnectDB(cfg config.Config) {
	var err error
	dsn := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		cfg.DBHost, cfg.DBPort, cfg.DBUser, cfg.DBPassword, cfg.DBName)

	DB, err = sql.Open("postgres", dsn)
	if err != nil {
		log.Fatal("Failed to connect to DB:", err)
	}

	if err = DB.Ping(); err != nil {
		log.Fatal("DB not responding:", err)
	}

	fmt.Println("Connected to PostgreSQL")
}
