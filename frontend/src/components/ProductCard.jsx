import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  const discountedPrice = product.price * (1 - (product.discount || 0) / 100);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please log in to add items to your cart.');
      return;
    }
    if (user.role === 'admin') {
      alert('Admin accounts cannot make purchases or add items to cart.');
      return;
    }
    try {
      await addToCart(product._id, 1);
      alert(`"${product.name}" has been added to your cart.`);
    } catch (err) {
      alert(err);
    }
  };

  return (
    <div className="glass-card" style={{
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      position: 'relative'
    }}>
      {/* Discount Badge */}
      {product.discount > 0 && (
        <div style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          zIndex: 10
        }}>
          <span className="badge-discount">-{product.discount}% OFF</span>
        </div>
      )}

      {/* Product Image */}
      <Link to={`/products/${product._id}`} style={{ display: 'block', overflow: 'hidden', background: '#120b08' }}>
        <img
          src={product.image}
          alt={product.name}
          style={{
            width: '100%',
            height: '250px',
            objectFit: 'cover',
            transition: 'var(--transition)',
            display: 'block'
          }}
          onMouseOver={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; }}
          onMouseOut={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
        />
      </Link>

      {/* Content */}
      <div style={{
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1
      }}>
        {/* Category Label */}
        <span style={{
          color: 'var(--gold-accent)',
          fontSize: '0.75rem',
          textTransform: 'uppercase',
          fontWeight: 600,
          letterSpacing: '1px',
          marginBottom: '8px',
          fontFamily: 'var(--font-ui)'
        }}>{product.category}</span>

        {/* Product Title */}
        <h3 style={{
          fontSize: '1.05rem',
          fontWeight: 600,
          marginBottom: '10px',
          fontFamily: 'var(--font-ui)',
          lineHeight: '1.4',
          height: '44px',
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical'
        }}>
          <Link to={`/products/${product._id}`} style={{ color: '#ffffff', transition: 'var(--transition)' }} onMouseOver={(e) => { e.currentTarget.style.color = 'var(--gold-accent)'; }} onMouseOut={(e) => { e.currentTarget.style.color = '#ffffff'; }}>
            {product.name}
          </Link>
        </h3>

        {/* Rating Block */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          marginBottom: '12px',
          color: 'var(--gold-accent)',
          fontSize: '0.85rem'
        }}>
          <span>★★★★★</span>
          <span style={{ color: 'var(--secondary-text)', fontSize: '0.75rem', marginLeft: '4px', fontFamily: 'var(--font-ui)' }}>(4.9)</span>
        </div>

        {/* Price Tag */}
        <div style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: '10px',
          marginBottom: '20px'
        }}>
          <span style={{
            fontSize: '1.25rem',
            fontWeight: 700,
            color: 'var(--gold-accent)',
            fontFamily: 'var(--font-ui)'
          }}>₹{discountedPrice.toFixed(2)}</span>
          {product.discount > 0 && (
            <span style={{
              fontSize: '0.9rem',
              color: 'var(--secondary-text)',
              textDecoration: 'line-through',
              opacity: 0.6
            }}>₹{product.price.toFixed(2)}</span>
          )}
        </div>

        {/* Actions Grid */}
        <div style={{
          marginTop: 'auto',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '10px'
        }}>
          <Link
            to={`/products/${product._id}`}
            className="btn-secondary"
            style={{
              padding: '10px 0',
              fontSize: '0.75rem',
              textAlign: 'center'
            }}
          >
            Details
          </Link>
          <button
            onClick={handleAddToCart}
            className="btn-primary"
            style={{
              padding: '10px 0',
              fontSize: '0.75rem'
            }}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
