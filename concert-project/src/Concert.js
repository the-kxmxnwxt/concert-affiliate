import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Concert.css";
import { useKeycloak } from "@react-keycloak/web";
import { logConcertClick } from "./keep_log/log_click";

const Concerts = () => {
  const { keycloak } = useKeycloak();
  const [concerts, setConcerts] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");  // เพิ่ม state สำหรับการค้นหา

  useEffect(() => {
    const fetchConcerts = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/v1/external/concerts", {
          headers: {
            Authorization: `Bearer ${keycloak.token}`,
          },
        });
        setConcerts(res.data);
      } catch (err) {
        console.error("Error fetching concerts:", err);
      }
    };

    if (keycloak.authenticated) {
      fetchConcerts();
    }
  }, [keycloak]);

  const handleClick = (concert) => {
    const detailUrl = `/concerts/${concert.id}`;
    logConcertClick(concert.id, detailUrl, keycloak.token);
  };

  // ฟิลเตอร์คอนเสิร์ตตามประเภทและคำค้นหาจากชื่อคอนเสิร์ต
  const filteredConcerts = concerts.filter((concert) => {
    const matchesCategory =
      categoryFilter === "All" || concert.category === categoryFilter;
    const matchesSearch =
      concert.name.toLowerCase().includes(searchTerm.toLowerCase());  // ฟิลเตอร์ชื่อคอนเสิร์ต
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="concerts-container">
      <h2 className="concerts-title">คอนเสิร์ต</h2>

      {/* ✅ Category and Search Bar - Flexbox Layout */}
      <div className="category-search-container">
        {/* Category Buttons */}
        <div className="category-buttons">
          {["All", "Pop", "Rock", "Classical", "Jazz", "Electronic"].map((cat) => (
            <button
              key={cat}
              className={`category-btn ${categoryFilter === cat ? "active" : ""}`}
              onClick={() => setCategoryFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="ค้นหาคอนเสิร์ต..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="concerts-grid">
        {filteredConcerts.map((concert, index) => (
          <div
            className="concert-card"
            key={concert.id}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <img
              src={concert.image_url}
              alt={concert.name}
              className="concert-img"
            />
            <div className="concert-details">
              <h3 className="concert-name">{concert.name}</h3>
              <p className="concert-date">
                📅{" "}
                {new Date(concert.date).toLocaleDateString("th-TH", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
              <p className="concert-location">📍 {concert.location}</p>
              <button
                className="buy-button"
                onClick={() => handleClick(concert)}
              >
                View Detail
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Concerts;
