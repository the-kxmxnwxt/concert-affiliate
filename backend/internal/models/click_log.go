package models

type ClickLog struct {
	ID           string `json:"id"`
	AffiliatorID string `json:"affiliator_id"`
	WebsiteURL   string `json:"website_url"`
	ConcertID    string `json:"concert_id"`
}
