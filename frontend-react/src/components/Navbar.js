// frontend-react/src/components/Navbar.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../App.css'; // Assuming styles.css content is in App.css

const Navbar = () => {
  const location = useLocation(); // Hook to get current path

  return (
    <nav className="navbar">
      <div className="logo">Shuttle Service</div>
      <ul className="nav-links">
        <li><Link to="/" className={location.pathname === "/" ? "active" : ""}>Home</Link></li>
        <li><Link to="/booking" className={location.pathname === "/booking" ? "active" : ""}>Booking</Link></li>
        <li><Link to="/contact" className={location.pathname === "/contact" ? "active" : ""}>Contact</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;