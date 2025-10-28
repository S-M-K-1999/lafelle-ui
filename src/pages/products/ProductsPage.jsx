import React, { useEffect, useState } from 'react';
import api from '../../services/api'; // your axios instance
import './ProductsPage.css'; // small overrides (shown below)

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchProducts = async () => {
      try {
        const res = await api.get('/v1/products');
        if (mounted) setProducts(res.data || []);
      } catch (err) {
        console.error('Fetch products error', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchProducts();
    return () => { mounted = false; };
  }, []);

  const deleteProduct = async (id) => {
    if (!window.confirm('Delete product?')) return;
    try {
      await api.delete(`/v1/products/${id}`);
      setProducts(prev => prev.filter(p => p._id !== id));
    } catch (err) {
      console.error('Delete error', err);
      alert('Failed to delete product');
    }
  };

  if (loading) return <div className="container py-5">Loading...</div>;

  return (
    <div className="container py-4">
      <h1 className="mb-4">Flowers In Box</h1>

      {/* Bootstrap responsive grid:
          row-cols-3 always attempts 3 columns,
          row-cols-sm-3, row-cols-md-3 keep 3 up to md,
          you can adapt for larger screens with row-cols-lg-4 etc.
      */}
      <div className="row row-cols-3 row-cols-sm-3 row-cols-md-3 row-cols-lg-5 g-3">
        {products.map(product => (
          <div className="col" key={product._id}>
            <div className="card h-100 product-card">
              <div className="ratio ratio-4x3">
                {/* use ratio to make images consistent */}
                <img
                  src={product.imageUrl}
                  className="card-img-top object-cover"
                  alt={product.name}
                  onError={(e)=>{ e.currentTarget.style.display='none'; }}
                />
              </div>
              <div className="card-body d-flex flex-column justify-content-between">
                <div>
                  <h5 className="card-title text-truncate">{product.name}</h5>
                  <p className="mb-1 fw-bold">₹{Number(product.price).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;
