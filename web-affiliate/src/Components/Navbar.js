import React from 'react';
import '../Style/Navbar.css';

const Navbar = () => {
  return (
    <div className="navbar-container">
      <div className="navbar-top">
        <div className="navbar-brand">
          <h1>Concerts</h1>
        </div>
        
        <div className="navbar-center">
          <div className="navbar-menu">
            <nav>
              <ul className="main-menu">
                <li><a href="/microwave">Microwave</a></li>
                <li><a href="/capibara">Capibara</a></li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;