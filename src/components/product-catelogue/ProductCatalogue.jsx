import React, { useEffect, useState } from "react";
import FilterSidebar from "../filter-sidebar/FilterSidebar";
import ProductCard from "../filter-sidebar/ProductCard";
import "./ProductCatalogue.scss";

const ProductCatalogue = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const API_BASE_URL = process.env.REACT_APP_API_URL;
  const API_VERSION = process.env.REACT_APP_VERSION;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/${API_VERSION}/products`);
        const data = await response.json();
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, [API_BASE_URL, API_VERSION]);

  const handleFilterChange = (filters) => {
    let filtered = [...products];

    // Category Filter
    if (filters.category.length > 0) {
      filtered = filtered.filter((p) => filters.category.includes(p.category));
    }

    // Price Range Filter
    if (filters.priceRanges.length > 0) {
      filtered = filtered.filter((p) =>
        filters.priceRanges.some(
          (range) => p.price >= range.min && p.price <= range.max
        )
      );
    }

    // Search Filter
    if (filters.search) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  };

  return (
    <div className="catalogue-page">
      <div className="sidebar">
        <FilterSidebar products={products} onFilterChange={handleFilterChange} />
      </div>

      <div className="product-section">
        <div className="catalogue-header">
          <h2>All Products</h2>
          <p>{filteredProducts.length} items found</p>
        </div>

        <div className="product-grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))
          ) : (
            <p className="no-results">No products found 😢</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCatalogue;
