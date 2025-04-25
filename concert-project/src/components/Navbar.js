import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useKeycloak } from '@react-keycloak/web';
import './Navbar.css';

export default function Navbar() {
  const { keycloak } = useKeycloak();
  const navigate = useNavigate();

  const handleLogout = () => {
    keycloak.logout({ redirectUri: window.location.origin });
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/dashboard" className="navbar-logo">ConcertPartner</Link>
      </div>
      <ul className="navbar-links">
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/websites">Website</Link></li>
        <li><Link to="/concerts">Concerts</Link></li>
        <li><Link to="/swagger">API</Link></li>
      </ul>
      <div className="navbar-actions">
        {keycloak?.authenticated && (
          <button className="logout-button" onClick={handleLogout}>Logout</button>
        )}
      </div>
    </nav>
  );
}
