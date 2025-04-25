package models

type Website struct {
	ID           string `json:"id"`
	AffiliatorID string `json:"affiliator_id"`
	WebsiteURL   string `json:"site_url"`
}
