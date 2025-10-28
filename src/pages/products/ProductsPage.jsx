// src/pages/Products/ProductsPage.jsx
import React, { useEffect, useState } from "react";
import "./ProductsPage.css";
import api from "../../services/api"; // make sure this points to your axios instance
import { useNavigate } from "react-router-dom";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/v1/products");
        setProducts(res.data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) return <div className="loading">Loading products...</div>;

  return (
    <div className="products-container">
      <h2 className="products-title">Flowers In Box</h2>
      <div className="products-grid">
        {products.map((product) => (
          <div
            className="product-card"
            key={product._id}
            onClick={() => navigate(`/product/${product._id}`)}
          >
            <div className="image-container">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="product-image"
              />
            </div>
            <div className="product-details">
              <h3 className="product-name">{product.name}</h3>
              <div className="product-pricing">
                <span className="current-price">₹{product.price}</span>
                {product.originalPrice && (
                  <>
                    <span className="old-price">₹{product.originalPrice}</span>
                    <span className="discount">
                      {Math.round(
                        ((product.originalPrice - product.price) /
                          product.originalPrice) *
                          100
                      )}
                      % OFF
                    </span>
                  </>
                )}
              </div>
              <p className="delivery">Earliest Delivery: Today</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;
