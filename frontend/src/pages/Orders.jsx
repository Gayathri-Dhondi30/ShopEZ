import React, { useState, useEffect, useContext } from 'react';
import api from '../api';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Orders = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      try {
        const response = await api.get(`/orders/${user._id}`);
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  const getStatusClass = (status) => {
    switch (status) {
      case 'Order Placed': return 'placed';
      case 'Processing': return 'processing';
      case 'Shipped': return 'shipped';
      case 'Delivered': return 'delivered';
      default: return '';
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
        Retrieving Order History...
      </div>
    );
  }

  return (
    <div className="page-container animated-fade">
      {/* Title */}
      <h2 style={{
        fontSize: '2.2rem',
        fontWeight: 600,
        color: '#ffffff',
        marginBottom: '40px',
        textAlign: 'center',
        fontFamily: 'var(--font-display)'
      }}>
        Your Order <span style={{ color: 'var(--gold-accent)' }}>History</span>
      </h2>

      {orders.length === 0 ? (
        <div className="glass-card" style={{
          padding: '80px 40px',
          textAlign: 'center',
          border: '1px dashed var(--glass-border)'
        }}>
          <span style={{ fontSize: '3rem', color: 'var(--gold-accent)', display: 'block', marginBottom: '20px' }}>📦</span>
          <p style={{
            fontSize: '1.15rem',
            color: 'var(--secondary-text)',
            marginBottom: '30px',
            fontFamily: 'var(--font-ui)',
            fontWeight: 300
          }}>
            You have not placed any orders yet. Discover our premium leather goods to make your first purchase.
          </p>
          <Link to="/products" className="btn-primary" style={{ padding: '12px 30px' }}>Browse Shop</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          {orders.map((order) => (
            <div key={order._id} className="glass-card" style={{
              padding: '30px',
              background: 'rgba(28, 18, 13, 0.4)',
              border: '1px solid var(--glass-border)'
            }}>
              {/* Order Transaction Details */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '15px',
                borderBottom: '1px solid var(--glass-border)',
                paddingBottom: '20px',
                marginBottom: '20px',
                fontFamily: 'var(--font-ui)'
              }}>
                <div>
                  <span style={{ color: 'var(--secondary-text)', fontSize: '0.85rem', fontWeight: 300 }}>ORDER REFERENCE</span>
                  <div style={{ fontWeight: 600, color: '#ffffff', marginTop: '2px', letterSpacing: '0.5px' }}>
                    #{order._id.substring(order._id.length - 8).toUpperCase()}
                  </div>
                </div>
                <div>
                  <span style={{ color: 'var(--secondary-text)', fontSize: '0.85rem', fontWeight: 300 }}>DATE PLACED</span>
                  <div style={{ fontWeight: 600, color: '#ffffff', marginTop: '2px' }}>
                    {new Date(order.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
                <div>
                  <span style={{ color: 'var(--secondary-text)', fontSize: '0.85rem', fontWeight: 300 }}>TOTAL AMOUNT</span>
                  <div style={{ fontWeight: 700, color: 'var(--gold-accent)', marginTop: '2px' }}>
                    ₹{order.totalPrice.toFixed(2)}
                  </div>
                </div>
                <div>
                  <span style={{ color: 'var(--secondary-text)', fontSize: '0.85rem', display: 'block', marginBottom: '4px', fontWeight: 300 }}>SHIPPING STATUS</span>
                  <span className={`badge-status ${getStatusClass(order.status)}`}>
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Products in this order */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {order.products.map((item, idx) => {
                  const product = item.productId;
                  if (!product) return (
                    <div key={idx} style={{ color: 'var(--secondary-text)', fontSize: '0.9rem', fontStyle: 'italic', fontFamily: 'var(--font-ui)' }}>
                      - Product details have been archived by administrative control.
                    </div>
                  );
                  return (
                    <div key={item._id || idx} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '20px'
                    }}>
                      <img
                        src={product.image}
                        alt={product.name}
                        style={{
                          width: '65px',
                          height: '65px',
                          objectFit: 'cover',
                          borderRadius: '8px',
                          border: '1px solid var(--glass-border)'
                        }}
                      />
                      <div style={{ flexGrow: 1 }}>
                        <h4 style={{ fontSize: '1.05rem', fontFamily: 'var(--font-ui)', fontWeight: 500, color: '#ffffff', marginBottom: '4px' }}>
                          {product.name}
                        </h4>
                        <span style={{
                          color: 'var(--secondary-text)',
                          fontSize: '0.85rem',
                          fontFamily: 'var(--font-ui)',
                          fontWeight: 300
                        }}>
                          Quantity: {item.quantity} @ ₹{item.price.toFixed(2)} each
                        </span>
                      </div>
                      <div style={{ fontFamily: 'var(--font-ui)', fontWeight: 600, color: 'var(--gold-accent)', fontSize: '1.1rem' }}>
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
