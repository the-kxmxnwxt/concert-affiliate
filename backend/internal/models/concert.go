package models

import "time"

type Concert struct {
	ID          string    `json:"id"`
	Name        string    `json:"name"`
	Artist      string    `json:"artist"`
	Location    string    `json:"location"`
	Date        time.Time `json:"date"`
	Description string    `json:"description"`
	Price       int       `json:"price"`
	ImageURL    string    `json:"image_url"`
	DetailURL   string    `json:"detail_url"`
	Category    string    `json:"category"`
}
