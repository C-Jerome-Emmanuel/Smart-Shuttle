import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../App.css';

const Navbar = ({ user, onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear user session
    localStorage.removeItem('token');
    onLogout(null);
    navigate('/login'); // ✅ Redirect to login page
  };

  return (
    <nav className="navbar">
      <div className="logo">SmartShuttle</div>
      <ul className="nav-links">
        <li>
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
            Home
          </Link>
        </li>
        <li>
          <Link to="/booking" className={location.pathname === '/booking' ? 'active' : ''}>
            Booking
          </Link>
        </li>
        <li>
          <Link to="/contact" className={location.pathname === '/contact' ? 'active' : ''}>
            Contact
          </Link>
        </li>

        {user ? (
          <div className="user-section">
            <span className="username">👤 {user.name}</span>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        ) : (
          <>
            <li>
              <Link to="/login" className={location.pathname === '/login' ? 'active' : ''}>
                Login
              </Link>
            </li>
            <li>
              <Link to="/register" className={location.pathname === '/register' ? 'active' : ''}>
                Register
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
