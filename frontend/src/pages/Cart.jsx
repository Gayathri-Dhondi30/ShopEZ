import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import api from '../api';

const Cart = () => {
  const { cartItems, loading, removeFromCart, updateQuantity, clearCartState, getCartTotal } = useContext(CartContext);
  const navigate = useNavigate();
  const [checkingOut, setCheckingOut] = useState(false);

  const handleQuantityAdjust = async (item, delta) => {
    const newQty = item.quantity + delta;
    if (newQty < 1) return;
    if (newQty > item.productId.stock) {
      alert(`Cannot exceed available product stock of ${item.productId.stock}.`);
      return;
    }
    try {
      await updateQuantity(item._id, newQty);
    } catch (err) {
      alert(err);
    }
  };

  const handleCheckout = async () => {
    setCheckingOut(true);
    try {
      await api.post('/orders');
      clearCartState();
      alert('Order placed successfully! Thank you for purchasing from ShopEZ.');
      navigate('/orders');
    } catch (err) {
      alert(err.response?.data?.message || 'Error checking out order.');
    } finally {
      setCheckingOut(false);
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
        Gathering Cart Contents...
      </div>
    );
  }

  // Calculate original subtotal (before discount) to show savings
  const originalSubtotal = cartItems.reduce((sum, item) => {
    if (!item.productId) return sum;
    return sum + item.productId.price * item.quantity;
  }, 0);

  const discountedTotal = getCartTotal();
  const totalSavings = originalSubtotal - discountedTotal;

  return (
    <div className="page-container animated-fade">
      <h2 style={{
        fontSize: '2.2rem',
        fontWeight: 600,
        color: '#ffffff',
        marginBottom: '40px',
        textAlign: 'center',
        fontFamily: 'var(--font-display)'
      }}>
        Your Shopping <span style={{ color: 'var(--gold-accent)' }}>Cart</span>
      </h2>

      {cartItems.length === 0 ? (
        <div className="glass-card" style={{
          padding: '80px 40px',
          textAlign: 'center',
          border: '1px dashed var(--glass-border)'
        }}>
          <span style={{ fontSize: '3rem', color: 'var(--gold-accent)', display: 'block', marginBottom: '20px' }}>🛒</span>
          <p style={{
            fontSize: '1.15rem',
            color: 'var(--secondary-text)',
            marginBottom: '30px',
            fontFamily: 'var(--font-ui)',
            fontWeight: 300
          }}>
            Your cart is currently empty. Add luxury leather items to get started!
          </p>
          <Link to="/products" className="btn-primary" style={{ padding: '12px 30px' }}>Browse Shop</Link>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '40px',
          alignItems: 'start'
        }}>
          {/* Left: Cart Items List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {cartItems.map((item) => {
              const product = item.productId;
              if (!product) return null;
              const itemDiscountPrice = product.price * (1 - (product.discount || 0) / 100);

              return (
                <div key={item._id} className="glass-card" style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '20px',
                  gap: '20px',
                  background: 'rgba(28, 18, 13, 0.4)'
                }}>
                  {/* Image */}
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{
                      width: '90px',
                      height: '90px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      border: '1px solid var(--glass-border)'
                    }}
                  />

                  {/* Info details */}
                  <div style={{ flexGrow: 1 }}>
                    <span style={{
                      color: 'var(--gold-accent)',
                      fontSize: '0.75rem',
                      textTransform: 'uppercase',
                      fontWeight: 600
                    }}>{product.category}</span>
                    <h3 style={{
                      fontSize: '1.1rem',
                      fontFamily: 'var(--font-ui)',
                      fontWeight: 500,
                      margin: '2px 0 8px'
                    }}>
                      <Link to={`/products/${product._id}`} style={{ color: '#ffffff' }}>
                        {product.name}
                      </Link>
                    </h3>

                    {/* Price and discount */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ color: 'var(--gold-accent)', fontWeight: 600 }}>
                        ₹{itemDiscountPrice.toFixed(2)}
                      </span>
                      {product.discount > 0 && (
                        <span style={{
                          textDecoration: 'line-through',
                          color: 'var(--secondary-text)',
                          opacity: 0.5,
                          fontSize: '0.85rem'
                        }}>
                          ₹{product.price.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Quantity Actions */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: 'rgba(15, 11, 8, 0.6)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '8px',
                    overflow: 'hidden'
                  }}>
                    <button
                      onClick={() => handleQuantityAdjust(item, -1)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--gold-accent)',
                        padding: '6px 12px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                      }}
                    >-</button>
                    <span style={{
                      minWidth: '35px',
                      textAlign: 'center',
                      fontFamily: 'var(--font-ui)',
                      fontSize: '0.9rem',
                      fontWeight: 600
                    }}>{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityAdjust(item, 1)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--gold-accent)',
                        padding: '6px 12px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                      }}
                    >+</button>
                  </div>

                  {/* Subtotal Item Value */}
                  <div style={{
                    minWidth: '90px',
                    textAlign: 'right',
                    fontFamily: 'var(--font-ui)'
                  }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: 600, color: '#ffffff' }}>
                      ₹{(itemDiscountPrice * item.quantity).toFixed(2)}
                    </span>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="btn-danger"
                    style={{
                      padding: '8px 12px',
                      fontSize: '0.75rem',
                      borderRadius: '8px'
                    }}
                  >
                    Remove
                  </button>
                </div>
              );
            })}
          </div>

          {/* Right: Checkout summary */}
          <div className="glass-card" style={{
            padding: '30px',
            background: 'linear-gradient(135deg, rgba(28, 18, 13, 0.9) 0%, rgba(15, 11, 8, 0.9) 100%)',
            position: 'sticky',
            top: '100px'
          }}>
            <h3 style={{
              borderBottom: '1px solid var(--glass-border)',
              paddingBottom: '15px',
              marginBottom: '20px',
              fontSize: '1.3rem'
            }}>Order Summary</h3>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '15px',
              fontFamily: 'var(--font-ui)',
              fontSize: '0.95rem',
              color: 'var(--secondary-text)',
              marginBottom: '25px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Subtotal</span>
                <span style={{ color: '#ffffff' }}>₹{originalSubtotal.toFixed(2)}</span>
              </div>
              {totalSavings > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#2ecc71' }}>
                  <span>Leather Discount</span>
                  <span>-₹{totalSavings.toFixed(2)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Shipping</span>
                <span style={{ color: '#ffffff' }}>Complementary</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Tax (GST)</span>
                <span style={{ color: '#ffffff' }}>Included</span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                borderTop: '1px solid var(--glass-border)',
                paddingTop: '15px',
                fontSize: '1.2rem',
                fontWeight: 700,
                color: 'var(--gold-accent)',
                marginTop: '10px'
              }}>
                <span>Total Amount</span>
                <span>₹{discountedTotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="btn-primary"
              style={{ width: '100%', padding: '14px 0', fontSize: '0.9rem' }}
              disabled={checkingOut}
            >
              {checkingOut ? 'Placing Order...' : 'Secure Checkout'}
            </button>

            <div style={{
              textAlign: 'center',
              marginTop: '15px',
              fontSize: '0.75rem',
              color: 'var(--secondary-text)',
              fontFamily: 'var(--font-ui)',
              opacity: 0.6
            }}>
              🔒 Secure SSL Encrypted Checkout.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
