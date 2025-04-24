import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useKeycloak } from "@react-keycloak/web";
import "./ConcertDetail.css";

const ConcertDetail = () => {
  const { concertId } = useParams();
  const { keycloak } = useKeycloak();
  const navigate = useNavigate();
  const [concert, setConcert] = useState(null);

  useEffect(() => {
    const fetchConcertDetail = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/v1/external/concerts`, {
          headers: {
            Authorization: `Bearer ${keycloak.token}`,
          },
        });

        const found = res.data.find((c) => c.id === parseInt(concertId));
        setConcert(found);
      } catch (err) {
        console.error("Error fetching concert detail:", err);
      }
    };

    if (keycloak.authenticated) {
      fetchConcertDetail();
    }
  }, [concertId, keycloak]);

  if (!concert) {
    return <div className="concert-detail-loading">Loading concert details...</div>;
  }

  return (
    <div className="concert-detail-container">
      <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>

      <div className="concert-detail-card">
        <img src={concert.image_url} alt={concert.name} className="concert-image" />
        <div className="concert-detail-info">
          <h1>{concert.name}</h1>
          <p><strong>Artist:</strong> {concert.artist}</p>
          <p><strong>Location:</strong> {concert.location}</p>
          <p><strong>Date:</strong> {new Date(concert.date).toLocaleDateString()}</p>
          <p><strong>Description:</strong></p>
          <p className="description">{concert.description}</p>
          <a href={concert.detail_url} target="_blank" rel="noopener noreferrer" className="detail-link">
            🔗 View More Info
          </a>
        </div>
      </div>
    </div>
  );
};

export default ConcertDetail;
