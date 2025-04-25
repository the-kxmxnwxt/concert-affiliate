// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { ReactKeycloakProvider } from '@react-keycloak/web';
import keycloak from './keycloak';
import Homepage from './HomePage';
import DashboardPage from './DashboardPage';
import AddWebsite from './AddWebsite';
import Navbar from './components/Navbar';
import Concerts from './Concert';
import ConcertDetail from "./ConcertDetail";
import SwaggerUIPage from './SwaggerUI';

function AppLayout() {
  const location = useLocation();
  const hideNavbarOn = ['/']; // ซ่อนไว้หน้า Homepage

  const shouldHideNavbar = hideNavbarOn.includes(location.pathname);

  return (
    <>
      {!shouldHideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/websites" element={<AddWebsite />} />
        <Route path="/concerts" element={<Concerts />} />
        <Route path="/concerts/:concertId" element={<ConcertDetail />} />
        <Route path="/swagger" element={<SwaggerUIPage />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <ReactKeycloakProvider
      authClient={keycloak}
      initOptions={{
        onLoad: 'check-sso',
        pkceMethod: 'S256',
        redirectUri: window.location.origin,
      }}
    >
      <Router>
        <AppLayout />
      </Router>
    </ReactKeycloakProvider>
  );
}

export default App;
