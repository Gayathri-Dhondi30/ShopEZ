import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${id}`);
        setProduct(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Error loading product details.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleQuantityChange = (val) => {
    const newVal = Math.max(1, quantity + val);
    if (product && newVal > product.stock) {
      alert(`Cannot select more than available stock (${product.stock} units).`);
      return;
    }
    setQuantity(newVal);
  };

  const handleAddToCart = async () => {
    if (!user) {
      alert('Please log in to add items to your cart.');
      navigate('/login');
      return;
    }
    if (user.role === 'admin') {
      alert('Admin accounts cannot make purchases or use the shopping cart.');
      return;
    }
    if (product.stock === 0) {
      alert('We are sorry, but this product is currently out of stock.');
      return;
    }

    setAdding(true);
    try {
      await addToCart(product._id, quantity);
      alert(`Added ${quantity} units of "${product.name}" to your cart.`);
    } catch (err) {
      alert(err);
    } finally {
      setAdding(false);
    }
  };

  const handleBuyNow = async () => {
    if (!user) {
      alert('Please log in to purchase items.');
      navigate('/login');
      return;
    }
    if (user.role === 'admin') {
      alert('Admin accounts cannot make purchases.');
      return;
    }
    if (product.stock === 0) {
      alert('We are sorry, but this product is currently out of stock.');
      return;
    }

    try {
      await addToCart(product._id, quantity);
      navigate('/cart');
    } catch (err) {
      alert(err);
    }
  };

  if (loading) {
    return (
      <div className="page-container" style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: '150px',
        color: 'var(--gold-accent)',
        fontFamily: 'var(--font-ui)',
        fontSize: '1.2rem'
      }}>
        Inspecting Leather Craftsmanship Details...
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="page-container" style={{ textAlign: 'center', paddingTop: '150px' }}>
        <h2 style={{ color: '#e74c3c', marginBottom: '20px' }}>{error || 'Product not found.'}</h2>
        <Link to="/products" className="btn-secondary">Return to Catalog</Link>
      </div>
    );
  }

  const discountedPrice = product.price * (1 - (product.discount || 0) / 100);

  return (
    <div className="page-container animated-fade">
      {/* Breadcrumb Navigation */}
      <Link to="/products" style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        color: 'var(--gold-accent)',
        marginBottom: '35px',
        fontFamily: 'var(--font-ui)',
        fontWeight: 500,
        transition: 'var(--transition)'
      }} onMouseOver={(e) => { e.currentTarget.style.color = '#ffffff'; }} onMouseOut={(e) => { e.currentTarget.style.color = 'var(--gold-accent)'; }}>
        ← Return to Leather Collection
      </Link>

      <div className="glass-card" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
        gap: '50px',
        padding: '50px',
        background: 'linear-gradient(135deg, rgba(28, 18, 13, 0.8) 0%, rgba(15, 11, 8, 0.8) 100%)'
      }}>
        {/* Product Image Frame */}
        <div style={{
          overflow: 'hidden',
          borderRadius: '12px',
          border: '1px solid var(--glass-border)',
          background: '#120b08',
          height: '460px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <img
            src={product.image}
            alt={product.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: '11px'
            }}
          />
        </div>

        {/* Product Attributes Frame */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          {/* Category */}
          <span style={{
            color: 'var(--gold-accent)',
            fontSize: '0.8rem',
            textTransform: 'uppercase',
            fontWeight: 600,
            letterSpacing: '2px',
            marginBottom: '12px',
            fontFamily: 'var(--font-ui)'
          }}>{product.category}</span>

          {/* Product Name */}
          <h1 style={{
            fontSize: '2.2rem',
            color: '#ffffff',
            marginBottom: '20px',
            lineHeight: '1.25'
          }}>{product.name}</h1>

          {/* Customer Reviews Rating Mock */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            marginBottom: '24px',
            color: 'var(--gold-accent)',
            fontSize: '0.95rem'
          }}>
            <span>★★★★★</span>
            <span style={{ color: 'var(--secondary-text)', fontSize: '0.8rem', fontFamily: 'var(--font-ui)', marginLeft: '4px' }}>(4.9 stars out of 40 reviews)</span>
          </div>

          {/* Pricing Grid */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
            marginBottom: '28px'
          }}>
            <span style={{
              fontSize: '2rem',
              fontWeight: 700,
              color: 'var(--gold-accent)',
              fontFamily: 'var(--font-ui)'
            }}>₹{discountedPrice.toFixed(2)}</span>

            {product.discount > 0 && (
              <>
                <span style={{
                  fontSize: '1.15rem',
                  color: 'var(--secondary-text)',
                  textDecoration: 'line-through',
                  opacity: 0.6
                }}>₹{product.price.toFixed(2)}</span>
                <span className="badge-discount" style={{ fontSize: '0.8rem', padding: '5px 12px' }}>
                  -{product.discount}% OFF SPECIAL
                </span>
              </>
            )}
          </div>

          {/* Description Body */}
          <p style={{
            fontSize: '0.95rem',
            color: 'var(--secondary-text)',
            lineHeight: '1.8',
            marginBottom: '30px',
            fontWeight: 300
          }}>
            {product.description}
          </p>

          {/* Inventory Availability Track */}
          <div style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '0.95rem',
            marginBottom: '30px',
            fontWeight: 500,
            color: product.stock > 0 ? '#2ecc71' : '#e74c3c'
          }}>
            {product.stock > 0
              ? `✔ In Stock (${product.stock} units available)`
              : '✘ Temp Out of Stock'
            }
          </div>

          {/* Quantity and Actions Container */}
          {product.stock > 0 && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px'
            }}>
              {/* Quantity Picker */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.9rem', color: 'var(--secondary-text)' }}>Quantity:</span>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  background: 'rgba(15, 11, 8, 0.7)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: '8px',
                  overflow: 'hidden'
                }}>
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--gold-accent)',
                      padding: '10px 16px',
                      cursor: 'pointer',
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      transition: 'var(--transition)'
                    }}
                    onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(212, 163, 115, 0.1)'; }}
                    onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; }}
                  >-</button>
                  <span style={{
                    padding: '10px 20px',
                    minWidth: '60px',
                    textAlign: 'center',
                    fontFamily: 'var(--font-ui)',
                    fontWeight: 600
                  }}>{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--gold-accent)',
                      padding: '10px 16px',
                      cursor: 'pointer',
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      transition: 'var(--transition)'
                    }}
                    onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(212, 163, 115, 0.1)'; }}
                    onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; }}
                  >+</button>
                </div>
              </div>

              {/* Action Buttons Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '15px',
                marginTop: '10px'
              }}>
                <button
                  onClick={handleAddToCart}
                  className="btn-secondary"
                  style={{ padding: '14px 0', fontSize: '0.85rem' }}
                  disabled={adding}
                >
                  {adding ? 'Securing Item...' : 'Add to Cart'}
                </button>
                <button
                  onClick={handleBuyNow}
                  className="btn-primary"
                  style={{ padding: '14px 0', fontSize: '0.85rem' }}
                >
                  Buy Now
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
