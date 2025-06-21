// src/api/logConcertClick.js

export const logConcertClick = async (concertId, detailUrl, token, websiteUrl) => {
    try {
      await fetch('https://dispatched-blond-resolved-graduated.trycloudflare.com/api/v1/logs/click', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          concert_id: concertId,
          website_url: websiteUrl || window.location.hostname
        })
      });
    } catch (error) {
      console.error("Error logging concert click:", error);
    } finally {
      window.location.href = detailUrl;
    }
  };
  
