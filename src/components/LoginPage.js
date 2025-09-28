import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = ({ setIsLoggedIn, isLoggedIn }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn) {
      navigate('/admin');
    }
  }, [isLoggedIn, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simple validation with hardcoded credentials
    // NOTE: For a real app, this should be an Axios call to your Node.js backend.
    if (username === 'admin' && password === 'password123') {
      setIsLoggedIn(true);
      // In a real app, you would store a JWT/Token here, not just 'true'
      localStorage.setItem('isLoggedIn', 'true'); 
      navigate('/admin');
    } else {
      alert('Invalid username or password');
    }
  };

  // Inline styles for a softer, more branded look (often moved to CSS modules)
  const styles = {
    container: {
      minHeight: '100vh', // Ensure it covers the whole viewport
      height: '100vh', // Set exact height to prevent scroll
      backgroundImage: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', // Soft gradient background
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px',
      overflow: 'hidden', // Prevent any overflow
    },
    card: {
      width: '100%',
      maxWidth: '400px', // Use max-width for better responsiveness
      borderRadius: '15px',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)', // Deeper, softer shadow
      border: 'none',
      overflow: 'hidden',
    },
    header: {
      backgroundColor: '#f8f9fa', // Light gray background for the header
      color: '#495057', // Darker text color
      borderBottom: '1px solid #dee2e6',
      padding: '1.5rem',
    },
    // Custom style for the input focus to use a softer color
    inputFocus: {
        borderColor: '#81c784', // Soft Green/Floral Tone
        boxShadow: '0 0 0 0.25rem rgba(129, 199, 132, 0.25)',
    }
  };


  return (
    <div style={styles.container}>
      <div className="card" style={styles.card}>
        {/* Card Header with a branded touch */}
        <div className="card-header text-center" style={styles.header}>
            {/* Replace this with a real logo image for best effect! */}
            <h1 className="mb-1" style={{ fontSize: '2.5rem', fontWeight: 700, color: '#38761d' /* Dark Green */ }}>
                🌺 LAFELLE 🌸
            </h1>
            <p className="text-muted mb-0">Admin Access Only</p>
        </div>

        <div className="card-body p-4">
          <form onSubmit={handleSubmit}>
            <div className="form-group mb-3">
              <label className="form-label fw-bold">Username</label>
              <input
                type="text"
                className="form-control form-control-lg" // Larger input size
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Enter your username"
                // You would need to use a custom CSS class to apply inputFocus globally
                // For this example, we rely on the larger Bootstrap class 'form-control-lg'
              />
            </div>
            
            <div className="form-group mb-4">
              <label className="form-label fw-bold">Password</label>
              <input
                type="password"
                className="form-control form-control-lg" // Larger input size
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
              />
            </div>
            
            <div className="d-grid gap-2">
              <button 
                type="submit" 
                className="btn btn-lg" 
                // Custom Button Style for a Floral touch
                style={{ 
                    fontSize: '1.3rem', 
                    backgroundColor: '#81c784', // Soft Green
                    borderColor: '#68b16c',
                    color: 'white',
                    fontWeight: 'bold',
                    transition: 'background-color 0.2s',
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#68b16c'} // Darker on hover
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#81c784'} // Restore on mouse out
              >
                Log In
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;