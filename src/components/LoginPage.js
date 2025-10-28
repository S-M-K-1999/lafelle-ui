import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../App';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_URL}/v1/auth/login`, {
        email,
        password
      });

      const { token, user } = response.data;

      // Use the context login function
      login(token, user);
      
      // Navigate to admin dashboard
      navigate('/admin');
    } catch (error) {
      console.error('Login error:', error);
      
      if (error.response) {
        setError(error.response.data.message || 'Login failed. Please try again.');
      } else if (error.request) {
        setError('Unable to connect to server. Please check your connection.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      height: '100vh',
      backgroundImage: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px',
      overflow: 'hidden',
    },
    card: {
      width: '100%',
      maxWidth: '400px',
      borderRadius: '15px',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
      border: 'none',
      overflow: 'hidden',
    },
    header: {
      backgroundColor: '#f8f9fa',
      color: '#495057',
      borderBottom: '1px solid #dee2e6',
      padding: '1.5rem',
    },
    errorAlert: {
      backgroundColor: '#f8d7da',
      color: '#721c24',
      padding: '0.75rem 1.25rem',
      marginBottom: '1rem',
      border: '1px solid #f5c6cb',
      borderRadius: '0.375rem',
      fontSize: '0.9rem',
    },
    loadingSpinner: {
      display: 'inline-block',
      width: '1rem',
      height: '1rem',
      border: '2px solid transparent',
      borderTop: '2px solid currentColor',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      marginRight: '0.5rem',
    }
  };

  const spinnerStyles = `
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `;

  return (
    <div style={styles.container}>
      <style>{spinnerStyles}</style>
      
      <div className="card" style={styles.card}>
        <div className="card-header text-center" style={styles.header}>
            <h1 className="mb-1" style={{ fontSize: '2.5rem', fontWeight: 700, color: '#38761d' }}>
                🌺 LAFELLE 🌸
            </h1>
            <p className="text-muted mb-0">Admin Access Only</p>
        </div>

        <div className="card-body p-4">
          {error && (
            <div style={styles.errorAlert} role="alert">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group mb-3">
              <label className="form-label fw-bold">Email</label>
              <input
                type="email"
                className="form-control form-control-lg"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
                disabled={loading}
              />
            </div>
            
            <div className="form-group mb-4">
              <label className="form-label fw-bold">Password</label>
              <input
                type="password"
                className="form-control form-control-lg"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                disabled={loading}
              />
            </div>
            
            <div className="d-grid gap-2">
              <button 
                type="submit" 
                className="btn btn-lg" 
                disabled={loading}
                style={{ 
                  fontSize: '1.3rem', 
                  backgroundColor: loading ? '#a5d6a7' : '#81c784',
                  borderColor: '#68b16c',
                  color: 'white',
                  fontWeight: 'bold',
                  transition: 'background-color 0.2s',
                  opacity: loading ? 0.7 : 1,
                }}
                onMouseOver={(e) => {
                  if (!loading) {
                    e.currentTarget.style.backgroundColor = '#68b16c';
                  }
                }}
                onMouseOut={(e) => {
                  if (!loading) {
                    e.currentTarget.style.backgroundColor = '#81c784';
                  }
                }}
              >
                {loading ? (
                  <>
                    <span style={styles.loadingSpinner}></span>
                    Logging in...
                  </>
                ) : (
                  'Log In'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;