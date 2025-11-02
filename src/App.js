import React, { useState, useEffect } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ProductsPage from "./pages/products/ProductsPage"

import Navbar from "./components/Navbar";
import ProductsList from "./pages/productList/ProductsList";
import ShopPage from "./pages/productList/ShopPage";
import ProductForm from "./pages/productForm/ProductForm";
import LoginPage from "./components/LoginPage";
import ProductCatalogue from "./components/product-catelogue/ProductCatalogue"
import LandingPage from './components/LandingPage';

// Create Auth Context
export const AuthContext = React.createContext();

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check authentication status on app start
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  // Login function
  const login = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setIsLoggedIn(true);
    setUser(userData);
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
  };

  // Protected Route component
  const ProtectedRoute = ({ children, adminOnly = false }) => {
    if (!isLoggedIn) {
      return <Navigate to="/login" />;
    }
    
    if (adminOnly && user?.role !== 'admin') {
      return <Navigate to="/" />;
    }
    
    return children;
  };

  // Auth context value
  const authContextValue = {
    isLoggedIn,
    user,
    login,
    logout,
    loading
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={authContextValue}>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/user/products" element={<ProductCatalogue />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/login" element={
            isLoggedIn ? <Navigate to="/admin" /> : <LoginPage />
          } />
          
          {/* Admin Routes - Protected */}
          <Route path="/admin" element={
            <ProtectedRoute adminOnly={true}>
              <div className="container-fluid p-0">
                <Navbar />
                <div className="container mt-4">
                  <ProductsList />
                </div>
              </div>
            </ProtectedRoute>
          } />
          
          
          <Route path="/admin/create" element={
            <ProtectedRoute adminOnly={true}>
              <div className="container-fluid p-0">
                <Navbar />
                <div className="container mt-4">
                  <ProductForm />
                </div>
              </div>
            </ProtectedRoute>
          } />
          
          <Route path="/admin/edit/:id" element={
            <ProtectedRoute adminOnly={true}>
              <div className="container-fluid p-0">
                <Navbar />
                <div className="container mt-4">
                  <ProductForm />
                </div>
              </div>
            </ProtectedRoute>
          } />

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;