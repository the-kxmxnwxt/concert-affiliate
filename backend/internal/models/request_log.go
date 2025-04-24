package models

type RequestLog struct {
	ID           string              `json:"id"`
	AffiliatorID string              `json:"affiliator_id"`
	Endpoint     string              `json:"endpoint"`
	Method       string              `json:"method"`
	WebsiteURL   string              `json:"website_url"`
	QueryParams  map[string][]string `json:"query_params"`
}
