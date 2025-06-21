import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AddWebsites.css";
import { useKeycloak } from '@react-keycloak/web';

const AddWebsite = () => {
  const { keycloak } = useKeycloak();
  const [url, setUrl] = useState("");
  const [websites, setWebsites] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const token = keycloak.token;

  const fetchWebsites = async () => {
    try {
      const res = await axios.get("https://dispatched-blond-resolved-graduated.trycloudflare.com/api/v1/websites", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // ป้องกันกรณี res.data เป็น null หรือไม่ใช่ array
      const data = res.data;
      setWebsites(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching websites:", err);
      setWebsites([]); // fallback ป้องกัน .map()
    }
  };

  useEffect(() => {
    if (keycloak?.authenticated) {
      fetchWebsites();
    }
  }, [keycloak]);

  const handleAdd = async () => {
    if (!url) return;
    setLoading(true);
    try {
      await axios.post(
        "https://dispatched-blond-resolved-graduated.trycloudflare.com/api/v1/websites",
        { site_url: url },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("✅ Website added successfully!");
      setUrl("");
      fetchWebsites();
    } catch (err) {
      console.error("Error adding website:", err);
      setMessage("❌ Failed to add website");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`https://dispatched-blond-resolved-graduated.trycloudflare.com/api/v1/websites/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchWebsites();
    } catch (err) {
      console.error("Error deleting website:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="website-container modern">
      <h2>🔗 Referrer Website Manager</h2>
      <div className="input-group">
        <input
          type="text"
          placeholder="Enter website URL (e.g., https://example.com)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={loading}
        />
        <button onClick={handleAdd} disabled={loading || !url}>Add</button>
      </div>
      {message && <p className="message">{message}</p>}

      <ul className="website-list">
        {Array.isArray(websites) && websites.map((site) => (
          <li key={site.id} className="website-item">
            <span>{site.site_url}</span>
            <button onClick={() => handleDelete(site.id)} disabled={loading}>Delete</button>
          </li>
        ))}
      </ul>

      {Array.isArray(websites) && websites.length === 0 && (
        <p className="empty-state">No websites registered yet.</p>
      )}
    </div>
  );
};

export default AddWebsite;
