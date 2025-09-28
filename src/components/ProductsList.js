import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/v1/products`);
        setProducts(response.data);
        setError(null);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to load products. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [API_URL]);

  const deleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`${API_URL}/v1/products/${id}`);
        setProducts(products.filter(product => product._id !== id));
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product. Please try again.');
      }
    }
  };

  const styles = {
    container: {
      padding: '2rem',
      maxWidth: '1200px',
      margin: '0 auto',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '2rem',
      paddingBottom: '1rem',
      borderBottom: '2px solid #e9ecef',
    },
    title: {
      fontSize: '4rem', // 4rem = 40px with 62.5% base
      fontWeight: '700',
      color: '#2c3e50',
      margin: 0,
    },
    createButton: {
      backgroundColor: '#81c784',
      border: 'none',
      color: 'white',
      padding: '1.2rem 2.4rem', // Increased padding
      borderRadius: '8px',
      fontSize: '1.6rem', // 1.6rem = 16px with 62.5% base
      fontWeight: '600',
      textDecoration: 'none',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      transition: 'all 0.3s ease',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    loadingContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '300px',
      fontSize: '1.6rem', // 1.6rem = 16px with 62.5% base
      color: '#6c757d',
    },
    errorContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '300px',
      fontSize: '1.6rem', // 1.6rem = 16px with 62.5% base
      color: '#dc3545',
      backgroundColor: '#f8d7da',
      border: '1px solid #f5c6cb',
      borderRadius: '8px',
      padding: '2rem',
    },
    emptyContainer: {
      textAlign: 'center',
      padding: '4rem 2rem',
      color: '#6c757d',
    },
    emptyIcon: {
      fontSize: '6.4rem', // 6.4rem = 64px with 62.5% base
      marginBottom: '1rem',
      opacity: 0.5,
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
      gap: '1.5rem',
      marginTop: '1rem',
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      overflow: 'hidden',
      transition: 'all 0.3s ease',
      border: '1px solid #e9ecef',
    },
    cardHover: {
      transform: 'translateY(-4px)',
      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
    },
    cardHeader: {
      backgroundColor: '#f8f9fa',
      padding: '1.5rem',
      borderBottom: '1px solid #e9ecef',
    },
    productName: {
      fontSize: '2.4rem', // 2.4rem = 24px with 62.5% base
      fontWeight: '600',
      color: '#2c3e50',
      margin: '0 0 0.5rem 0',
    },
    productPrice: {
      fontSize: '2.8rem', // 2.8rem = 28px with 62.5% base
      fontWeight: '700',
      color: '#81c784',
      margin: 0,
    },
    cardBody: {
      padding: '1.5rem',
    },
    productDescription: {
      color: '#6c757d',
      fontSize: '1.6rem', // 1.6rem = 16px with 62.5% base
      lineHeight: '1.5',
      marginBottom: '1.5rem',
      minHeight: '3rem',
    },
    actionsContainer: {
      display: 'flex',
      gap: '0.75rem',
      justifyContent: 'flex-end',
    },
    actionButton: {
      padding: '0.8rem 1.6rem', // Increased padding
      borderRadius: '6px',
      fontSize: '1.4rem', // 1.4rem = 14px with 62.5% base
      fontWeight: '500',
      textDecoration: 'none',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.25rem',
      transition: 'all 0.2s ease',
      border: 'none',
      cursor: 'pointer',
    },
    editButton: {
      backgroundColor: '#17a2b8',
      color: 'white',
    },
    deleteButton: {
      backgroundColor: '#dc3545',
      color: 'white',
    },
    statsContainer: {
      display: 'flex',
      gap: '1rem',
      marginBottom: '2rem',
      flexWrap: 'wrap',
    },
    statCard: {
      backgroundColor: 'white',
      padding: '1.5rem',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      border: '1px solid #e9ecef',
      flex: '1',
      minWidth: '200px',
    },
    statNumber: {
      fontSize: '3.2rem', // 3.2rem = 32px with 62.5% base
      fontWeight: '700',
      color: '#81c784',
      margin: '0 0 0.5rem 0',
    },
    statLabel: {
      color: '#6c757d',
      fontSize: '1.4rem', // 1.4rem = 14px with 62.5% base
      margin: 0,
    },
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <div>🔄 Loading products...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.errorContainer}>
          <div>❌ {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>Product Management</h1>
        <Link to="/admin/create" style={styles.createButton}>
          ➕ Add New Product
        </Link>
      </div>

      {/* Stats */}
      <div style={styles.statsContainer}>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{products.length}</div>
          <div style={styles.statLabel}>Total Products</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>
            ${products.reduce((sum, product) => sum + parseFloat(product.price || 0), 0).toFixed(2)}
          </div>
          <div style={styles.statLabel}>Total Value</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>
            ${products.length > 0 ? (products.reduce((sum, product) => sum + parseFloat(product.price || 0), 0) / products.length).toFixed(2) : '0.00'}
          </div>
          <div style={styles.statLabel}>Average Price</div>
        </div>
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <div style={styles.emptyContainer}>
          <div style={styles.emptyIcon}>📦</div>
          <h3>No products found</h3>
          <p>Get started by adding your first product!</p>
          <Link to="/admin/create" style={styles.createButton}>
            ➕ Add Your First Product
          </Link>
        </div>
      ) : (
        <div style={styles.grid}>
          {products.map((product) => (
            <div key={product._id} style={styles.card}>
              <div style={styles.cardHeader}>
                <h3 style={styles.productName}>{product.name}</h3>
                <div style={styles.productPrice}>${product.price}</div>
              </div>
              <div style={styles.cardBody}>
                <p style={styles.productDescription}>
                  {product.description || 'No description available'}
                </p>
                <div style={styles.actionsContainer}>
                  <Link
                    to={`/admin/edit/${product._id}`}
                    style={{...styles.actionButton, ...styles.editButton}}
                  >
                    ✏️ Edit
                  </Link>
                  <button
                    onClick={() => deleteProduct(product._id)}
                    style={{...styles.actionButton, ...styles.deleteButton}}
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
  );
};

export default ProductsList;