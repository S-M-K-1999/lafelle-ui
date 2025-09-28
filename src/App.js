import React, { useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import ProductsList from "./components/ProductsList";
import ProductForm from "./components/ProductForm";
import LoginPage from "./components/LoginPage";

// Components
import LandingPage from './components/LandingPage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem('isLoggedIn') === 'true'
  );

  return (
    <Router>
      <Routes>
        {/* Pass isLoggedIn to LoginPage */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage setIsLoggedIn={setIsLoggedIn} isLoggedIn={isLoggedIn} />} />
        <Route path="/admin" element={
          <div className="container">
            {isLoggedIn && <Navbar setIsLoggedIn={setIsLoggedIn} />}
            <br/>
            {isLoggedIn ? <ProductsList /> : <Navigate to="/login" />}
          </div>
        } />
        <Route path="/admin/create" element={
          <div className="container">
            {isLoggedIn && <Navbar setIsLoggedIn={setIsLoggedIn} />}
            <br/>
            {isLoggedIn ? <ProductForm /> : <Navigate to="/login" />}
          </div>
        } />
        <Route path="/admin/edit/:id" element={
          <div className="container">
            {isLoggedIn && <Navbar setIsLoggedIn={setIsLoggedIn} />}
            <br/>
            {isLoggedIn ? <ProductForm /> : <Navigate to="/login" />}
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;