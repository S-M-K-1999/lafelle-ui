import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ setIsLoggedIn }) => { // Accept setIsLoggedIn as a prop
    const handleLogout = () => {
        // Step 1: Clear the login status in localStorage
        localStorage.removeItem('isLoggedIn');
        // Step 2: Update the state in App.js to force a re-render
        setIsLoggedIn(false);
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <Link to="/admin" className="navbar-brand">Admin Panel</Link>
            <div className="collapse navbar-collapse">
                <ul className="navbar-nav me-auto">
                    <li className="navbar-item">
                        <Link to="/admin/create" className="nav-link">Create Product</Link>
                    </li>
                </ul>
                <button onClick={handleLogout} className="btn btn-outline-danger" style={{ fontSize: '1.5rem' }}>Logout</button>
            </div>
        </nav>
    );
};

export default Navbar;