import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api'
import { categoryService } from '../../services/category';
import './ProductsList.css';

const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoriesError, setCategoriesError] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  // Filter states
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [priceRange, setPriceRange] = useState(['', '']);

  const dropdownRef = useRef(null);


  // Fetch products and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setCategoriesLoading(true);
        
        // Fetch products
        const productsResponse = await api.get('/v1/products');
        const productsData = productsResponse.data;
        setProducts(productsData);
        setFilteredProducts(productsData);
        
        // Fetch categories from backend
        const categoriesResponse = await categoryService.getAll();
        const categoriesData = categoriesResponse.data;
        setCategories(categoriesData);
        
        // Set initial price range
        if (productsData.length > 0) {
          const prices = productsData.map(p => parseFloat(p.price) || 0);
          const min = Math.min(...prices);
          const max = Math.max(...prices);
          setPriceRange([min, max]);
          setMinPrice(min.toString());
          setMaxPrice(max.toString());
        }
        
        setError(null);
        setCategoriesError(null);
      } catch (error) {
        console.error('Error fetching data:', error);
        if (error.response?.status === 404) {
          setCategoriesError('Categories not found. Please create some categories first.');
        } else {
          setError('Failed to load products. Please try again.');
        }
      } finally {
        setLoading(false);
        setCategoriesLoading(false);
      }
    };
    fetchData();
  }, []);

  // Apply filters whenever filter criteria change
  useEffect(() => {
    if (products.length === 0) return;

    let filtered = [...products];

    // Category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(product => {
        const categoryId = typeof product.category === 'object' && product.category._id 
          ? product.category._id 
          : product.category;
        return selectedCategories.includes(categoryId);
      });
    }

    // Price filter
    const min = parseFloat(minPrice) || 0;
    const max = parseFloat(maxPrice) || Number.MAX_SAFE_INTEGER;
    
    filtered = filtered.filter(product => {
      const price = parseFloat(product.price) || 0;
      return price >= min && price <= max;
    });

    setFilteredProducts(filtered);
  }, [products, selectedCategories, minPrice, maxPrice]);

  // This useEffect handles click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const deleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/v1/products/${id}`);
  
        // Filter out the deleted product
        const updatedProducts = products.filter(product => product._id !== id);
        const updatedFiltered = filteredProducts.filter(product => product._id !== id);
  
        // Update both product states
        setProducts(updatedProducts);
        setFilteredProducts(updatedFiltered);
  
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product. Please try again.');
      }
    }
  };

  const handleCategoryToggle = (categoryId) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleSelectAll = () => {
    if (selectedCategories.length === categories.length) {
      // If all are selected, clear selection
      setSelectedCategories([]);
    } else {
      // Select all category IDs
      const allCategoryIds = categories.map(cat => cat._id);
      setSelectedCategories(allCategoryIds);
    }
  };
  
  const handlePriceChange = (type, value) => {
    if (type === 'min') {
      setMinPrice(value);
    } else {
      setMaxPrice(value);
    }
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setMinPrice(priceRange[0].toString());
    setMaxPrice(priceRange[1].toString());
  };

  const formatPrice = (price) => {
    return parseFloat(price).toFixed(2);
  };

  const getCategoryName = (category) => {
    if (typeof category === 'object' && category.name) {
      return category.name;
    }
    
    // Find category name from categories list
    const foundCategory = categories.find(cat => cat._id === category);
    return foundCategory ? foundCategory.name : 'Uncategorized';
  };

  const getCategoryCount = (categoryId) => {
    return products.filter(product => {
      const productCategoryId = typeof product.category === 'object' && product.category._id 
        ? product.category._id 
        : product.category;
      return productCategoryId === categoryId;
    }).length;
  };

  // Calculate totalValue and averagePrice
  const totalValue = filteredProducts.reduce((sum, product) => sum + parseFloat(product.price || 0), 0);
  const averagePrice = filteredProducts.length > 0 ? totalValue / filteredProducts.length : 0;

  if (loading) {
    return (
      <div className="products-main-container">
        <div className="loading-container">
          <div className="spinner-border text-success me-3" role="status" style={{width: '3rem', height: '3rem'}}>
            <span className="visually-hidden">Loading...</span>
          </div>
          🔄 Loading products and categories...
        </div>
      </div>
    );
  }

  return (
    <div className="products-main-container">
      {/* Filter Sidebar */}
      <div className="filter-sidebar">
        <div className="filter-header">
          <h2 className="filter-title">🔍 Filters</h2>
          <button className="clear-filters" onClick={clearFilters}>
            Clear All
          </button>
        </div>

        {/* Price Filter */}
        <div className="filter-section">
          <h3 className="filter-section-title">💰 Price Range</h3>
          <div className="price-inputs">
            <input
              type="number"
              className="price-input"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => handlePriceChange('min', e.target.value)}
            />
            <input
              type="number"
              className="price-input"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => handlePriceChange('max', e.target.value)}
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="filter-section">
  <h3 className="filter-section-title">🏷️ Categories</h3>
  {categoriesLoading ? (
    <div className="loading-categories">
      <div className="spinner-border spinner-border-sm text-success me-2" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      Loading categories...
    </div>
  ) : categoriesError ? (
    <div className="categories-error" style={{color: '#dc3545', fontSize: '1.2rem'}}>
      ⚠️ {categoriesError}
    </div>
  ) : categories.length === 0 ? (
    <div className="no-categories" style={{color: '#6c757d', fontSize: '1.2rem'}}>
      No categories found
    </div>
  ) : (
    <div className="category-dropdown" ref={dropdownRef}>
      <div 
        className={`dropdown-header ${selectedCategories.length > 0 ? 'open' : ''}`}
        onClick={() => setDropdownOpen(!dropdownOpen)}
        style={{cursor: "pointer"}}
      >
        <span style={{fontSize: "1.4rem"}}> {/* Increased from 1rem to 1.4rem */}
          {selectedCategories.length === 0 
            ? 'Select categories...' 
            : `${selectedCategories.length} category${selectedCategories.length > 1 ? 's' : ''} selected`
          }
        </span>
        <span className={`dropdown-arrow ${dropdownOpen ? 'open' : ''}`}>▼</span>
      </div>
      
      {dropdownOpen && (
        <div className="dropdown-list">
          {/* Select All Option */}
          <div 
            className={`dropdown-item select-all-item ${selectedCategories.length === categories.length ? 'selected' : ''}`}
            onClick={() => handleSelectAll()}
          >
            <div className="category-checkbox"></div>
            <span className="item-name">Select All Categories</span>
            <span className="item-count">{categories.length}</span>
          </div>
          
          {/* Category List */}
          {categories.map(category => (
            <div
              key={category._id}
              className={`dropdown-item ${selectedCategories.includes(category._id) ? 'selected' : ''}`}
              onClick={() => handleCategoryToggle(category._id)}
            >
              <div className="category-checkbox"></div>
              <div className="item-content">
                <div className="item-name">{category.name}</div>
                {category.description && (
                  <div 
                    className="category-description" 
                    style={{fontSize: '1rem', color: '#6c757d', fontStyle: 'italic'}}
                  >
                    {category.description}
                  </div>
                )}
              </div>
              <span className="item-count">{getCategoryCount(category._id)}</span>
            </div>
          ))}
        </div>
      )}
          </div>
        )}
      </div>
      </div>

      {/* Main Content */}
      <div className="products-content">
        {/* Header */}
        <div className="products-header">
          <h1 className="products-title">📦 Product Management</h1>
          <div style={{display: 'flex', gap: '1rem'}}>
            <Link to="/admin/create" className="create-button">
              ➕ Add New Product
            </Link>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="error-container" style={{marginBottom: '2rem'}}>
            <div>❌ {error}</div>
          </div>
        )}

        {/* Results Info */}
        <div className="filter-results">
          Showing {filteredProducts.length} of {products.length} products
          {(selectedCategories.length > 0 || minPrice || maxPrice) && (
            <span> • Filters applied</span>
          )}
        </div>

        {/* Stats */}
        <div className="stats-container">
          <div className="stat-card">
            <div className="stat-number">{filteredProducts.length}</div>
            <div className="stat-label">Filtered Products</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">${formatPrice(totalValue)}</div>
            <div className="stat-label">Total Value</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">${formatPrice(averagePrice)}</div>
            <div className="stat-label">Average Price</div>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="empty-container">
            <div className="empty-icon">🔍</div>
            <h3>No products found</h3>
            <p>Try adjusting your filters or add new products</p>
            <div style={{display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap'}}>
              {/* <Link to="/admin/categories" className="create-button" style={{backgroundColor: '#17a2b8'}}>
                🏷️ Manage Categories
              </Link> */}
              <Link to="/admin/create" className="create-button">
                ➕ Add New Product
              </Link>
            </div>
          </div>
        ) : (
          <div className="products-grid">
            {filteredProducts.map((product) => (
              <div key={product._id} className="product-card">
                {/* Product Image */}
                {product.imageUrl && (
                  <img 
                    src={product.imageUrl} 
                    alt={product.name}
                    className="product-image"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                )}
                
                <div className="card-header">
                  {/* Category Badge */}
                  {product.category && (
                    <span className="category-badge">
                      {getCategoryName(product.category)}
                    </span>
                  )}
                  <h3 className="product-name">{product.name}</h3>
                  <div className="product-price">${formatPrice(product.price)}</div>
                </div>
                
                <div className="card-body">
                  <p className="product-description">
                    {product.description || 'No description available'}
                  </p>
                  
                  <div className="actions-container">
                    <Link
                      to={`/admin/edit/${product._id}`}
                      className="action-button edit-button"
                    >
                      ✏️ Edit
                    </Link>
                    <button
                      onClick={() => deleteProduct(product._id)}
                      className="action-button delete-button"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>  
        )}
      </div>
    </div>
  );
};

export default ProductsList;