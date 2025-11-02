import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./ShopPage.scss";
import Logo from "../../assets/navbar/logo.png";

const ShopPage = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true); // ✅ Loading state
  const productsPerPage = 9;

  // ✅ Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/${process.env.REACT_APP_VERSION}/products`);
        setProducts(res.data || []);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false); // ✅ Stop loading once fetch is done
      }
    };
    fetchProducts();
  }, []);

  const totalPages = Math.ceil(products.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const currentProducts = products.slice(startIndex, startIndex + productsPerPage);

  const handleAddToCart = () => setCartCount((count) => count + 1);

  const handleBuyNow = (product) => {
    const whatsappNumber = process.env.REACT_APP_WHATSAPP_NUMBER; 
    const message = `Hello! I'm interested in your product \nName: *${product.name}* \nCategory: ${product.category?.name} \nprice: $${product.price}.`;
    const encodedMsg = encodeURIComponent(message);
    window.open(`https://wa.me/${whatsappNumber}?text=${encodedMsg}`, "_blank");
  };

  if (loading) {
    return (
      <div className="loading-screen d-flex flex-column justify-content-center align-items-center vh-100 text-center bg-light">
        <div className="spinner-border text-dark mb-4" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <h2 className="mb-2">Your beautiful store is loading...</h2>
        <p className="text-muted">Just a moment, amazing products are on their way!</p>
      </div>
    );
  }

  return (
    <div className="shop-page">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg bg-white border-bottom py-3 shadow-sm">
        <div className="container">
          <div className="d-flex align-items-center">
            <img src={Logo} alt="logo" className="logo me-2" style={{ width: '150px', height: 'auto' }} />
          </div>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarMenu"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse justify-content-center" id="navbarMenu">
            <ul className="navbar-nav mb-2 mb-lg-0">
              <li className="nav-item mx-3"><a href="/" className="nav-link">Home</a></li>
              <li className="nav-item mx-3"><a href="/shop" className="nav-link active">Shop</a></li>
            </ul>
          </div>

          <div className="d-flex align-items-center">
            <button className="btn btn-outline-secondary me-2 rounded-pill">
              <i className="bi bi-funnel"></i> Filters
            </button>

            <div className="search-bar position-relative me-3">
              <input type="text" className="form-control rounded-pill" placeholder="Search product..." />
              <i className="bi bi-search search-icon"></i>
            </div>

            {/* Cart Icon */}
            <div className="cart-icon position-relative">
              <i className="bi bi-cart3 fs-4"></i>
              {cartCount > 0 && (
                <span className="badge bg-danger rounded-circle">{cartCount}</span>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Product Grid */}
      <div className="container py-4 mb-5">
        <div className="row g-4">
          {currentProducts.map((p) => (
            <div key={p._id} className="col-6 col-md-4 col-lg-3">
              <div className="product-card text-center p-3">
                <img src={p.imageUrl} alt={p.name} className="img-fluid mb-3" />
                <h5 className="product-name">{p.name}</h5>
                <p className="product-model">{p.model}</p>
                <p className="product-price">${p.price?.toFixed(2)}</p>
                <div className="d-flex justify-content-between mt-3">
                  <button
                    className="btn btn-dark rounded-pill flex-fill me-2"
                    onClick={() => handleBuyNow(p)}
                  >
                    Buy Now
                  </button>
                  <button
                    className="btn btn-outline-dark rounded-pill flex-fill"
                    onClick={handleAddToCart}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fixed Pagination */}
      <div className="pagination-controls fixed-bottom bg-white py-3 border-top text-center">
        <button
          className="btn btn-outline-secondary me-2 rounded-pill"
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
        >
          Prev
        </button>
        <span className="mx-2 fw-semibold">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="btn btn-outline-secondary ms-2 rounded-pill"
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ShopPage;
