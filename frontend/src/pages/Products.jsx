import React, { useState, useEffect } from 'react';
import api from '../api';
import ProductCard from '../components/ProductCard';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });

  const categories = ['All', 'Bags', 'Wallets', 'Accessories'];

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (category && category !== 'All') params.category = category;
      if (priceRange.min) params.minPrice = priceRange.min;
      if (priceRange.max) params.maxPrice = priceRange.max;

      const response = await api.get('/products', { params });
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(handler);
  }, [search, category, priceRange.min, priceRange.max]);

  const handlePriceChange = (e) => {
    setPriceRange({ ...priceRange, [e.target.name]: e.target.value });
  };

  return (
    <div className="page-container animated-fade">
      {/* Catalog Title */}
      <h2 style={{
        fontSize: '2.2rem',
        fontWeight: 600,
        color: '#ffffff',
        marginBottom: '40px',
        textAlign: 'center',
        fontFamily: 'var(--font-display)'
      }}>
        Explore Our <span style={{ color: 'var(--gold-accent)' }}>Luxury Collection</span>
      </h2>

      {/* Filter Options Control Panel */}
      <div className="glass-card" style={{
        padding: '30px',
        marginBottom: '40px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '20px',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'rgba(28, 18, 13, 0.5)'
      }}>
        {/* Search */}
        <div style={{ flex: '1 1 300px' }}>
          <input
            type="text"
            placeholder="Search our luxury collection..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input"
          />
        </div>

        {/* Categories Tags */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={category === cat ? 'btn-primary' : 'btn-secondary'}
              style={{
                padding: '8px 20px',
                fontSize: '0.85rem',
                borderRadius: '8px'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Price Boundaries */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--secondary-text)', fontFamily: 'var(--font-ui)' }}>Price (₹):</span>
          <input
            type="number"
            name="min"
            placeholder="Min"
            value={priceRange.min}
            onChange={handlePriceChange}
            className="form-input"
            style={{ width: '80px', padding: '8px 12px' }}
          />
          <span style={{ color: 'var(--secondary-text)' }}>to</span>
          <input
            type="number"
            name="max"
            placeholder="Max"
            value={priceRange.max}
            onChange={handlePriceChange}
            className="form-input"
            style={{ width: '80px', padding: '8px 12px' }}
          />
        </div>
      </div>

      {/* Responsive Products Layout Grid */}
      {loading ? (
        <div style={{
          textAlign: 'center',
          color: 'var(--gold-accent)',
          padding: '80px 0',
          fontSize: '1.2rem',
          fontFamily: 'var(--font-ui)'
        }}>
          Polishing Catalog Items...
        </div>
      ) : products.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(285px, 1fr))',
          gap: '30px'
        }}>
          {products.map((product) => (
            <div key={product._id} className="animated-slideup">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      ) : (
        <div style={{
          textAlign: 'center',
          color: 'var(--secondary-text)',
          padding: '80px 0',
          fontSize: '1.1rem',
          fontFamily: 'var(--font-ui)',
          border: '1px dashed var(--glass-border)',
          borderRadius: 'var(--border-radius)'
        }}>
          No premium leather products found matching your filter selection.
        </div>
      )}
    </div>
  );
};

export default Products;
