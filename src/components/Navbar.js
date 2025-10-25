import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';

const Navbar = () => {
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light" style={{ backgroundColor: '#38761d', padding: '1rem 0' }}>
      <div className="container-fluid">
        {/* Brand - Larger */}
        <Link to="/admin" className="navbar-brand mb-0 h1 text-white" style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>
          🌺 LAFELLE
        </Link>

        {/* Toggle button for mobile */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">

          </ul>

          {/* User info and logout - Larger */}
          <div className="d-flex align-items-center">
            <span className="text-white me-4" style={{ fontSize: '1.3rem', fontWeight: '500' }}>
              👋 Welcome, <strong>{user?.name}</strong> 
              {user?.role === 'admin' && ' (Admin)'}
            </span>
            <button 
              onClick={handleLogout} 
              className="btn btn-outline-light"
              style={{ 
                fontSize: '1.3rem', 
                fontWeight: '500',
                padding: '0.75rem 1.5rem',
                borderWidth: '2px'
              }}
            >
              🚪 Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;