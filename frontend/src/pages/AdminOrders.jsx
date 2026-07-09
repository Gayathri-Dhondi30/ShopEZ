import React, { useState, useEffect } from 'react';
import api from '../api';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching global orders log:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.put(`/admin/orders/${orderId}`, { status: newStatus });
      alert(`Order status updated to "${newStatus}".`);
      fetchOrders();
    } catch (error) {
      alert(error.response?.data?.message || 'Error updating order status.');
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Order Placed': return 'placed';
      case 'Processing': return 'processing';
      case 'Shipped': return 'shipped';
      case 'Delivered': return 'delivered';
      default: return '';
    }
  };

  const statuses = ['Order Placed', 'Processing', 'Shipped', 'Delivered'];

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
        Manage <span style={{ color: 'var(--gold-accent)' }}>Orders</span>
      </h2>

      <div className="glass-card" style={{ padding: '30px', background: 'rgba(28, 18, 13, 0.45)' }}>
        <h3 style={{ fontSize: '1.25rem', color: 'var(--gold-accent)', marginBottom: '20px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '10px' }}>
          Customer Orders Log
        </h3>

        {loading ? (
          <div style={{ color: 'var(--gold-accent)', textAlign: 'center', padding: '50px 0', fontFamily: 'var(--font-ui)' }}>
            Retrieving Orders Log...
          </div>
        ) : orders.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
            {orders.map((order) => (
              <div key={order._id} style={{
                border: '1px solid var(--glass-border)',
                borderRadius: '8px',
                padding: '20px',
                background: 'rgba(15, 11, 8, 0.4)',
                display: 'flex',
                flexDirection: 'column',
                gap: '15px'
              }}>
                {/* Order header row */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  gap: '15px',
                  borderBottom: '1px dashed var(--glass-border)',
                  paddingBottom: '12px',
                  fontFamily: 'var(--font-ui)',
                  fontSize: '0.9rem'
                }}>
                  <div>
                    <span style={{ color: 'var(--secondary-text)', opacity: 0.6 }}>ORDER ID:</span>{' '}
                    <strong style={{ color: '#ffffff', letterSpacing: '0.5px' }}>#{order._id.substring(order._id.length - 8).toUpperCase()}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--secondary-text)', opacity: 0.6 }}>CUSTOMER:</span>{' '}
                    <strong style={{ color: '#ffffff' }}>
                      {order.userId ? `${order.userId.name} (${order.userId.email})` : 'Deleted Account'}
                    </strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--secondary-text)', opacity: 0.6 }}>REVENUE:</span>{' '}
                    <strong style={{ color: 'var(--gold-accent)', fontSize: '1rem' }}>₹{order.totalPrice.toFixed(2)}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--secondary-text)', opacity: 0.6 }}>DATE:</span>{' '}
                    <strong style={{ color: 'var(--secondary-text)' }}>
                      {new Date(order.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </strong>
                  </div>
                </div>

                {/* Items and Status Dropdown */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  gap: '20px'
                }}>
                  {/* Items List */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flexGrow: 1 }}>
                    {order.products.map((item, idx) => {
                      const product = item.productId;
                      return (
                        <div key={item._id || idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem' }}>
                          <span style={{ color: 'var(--gold-accent)', fontSize: '0.75rem' }}>■</span>
                          <span style={{ color: '#ffffff', fontWeight: 500 }}>{product ? product.name : 'Archived Product'}</span>
                          <span style={{ color: 'var(--secondary-text)' }}>x{item.quantity}</span>
                          <span style={{ color: 'var(--secondary-text)', opacity: 0.6 }}>(₹{item.price.toFixed(2)} each)</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Status controls */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px', fontFamily: 'var(--font-ui)' }}>
                    <div>
                      <span style={{ color: 'var(--secondary-text)', marginRight: '8px', fontSize: '0.85rem' }}>Current Status:</span>
                      <span className={`badge-status ${getStatusClass(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    <div>
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className="form-input"
                        style={{
                          padding: '6px 12px',
                          fontSize: '0.8rem',
                          background: '#1c120d',
                          width: '150px'
                        }}
                      >
                        {statuses.map(st => <option key={st} value={st}>{st}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ color: 'var(--secondary-text)', textAlign: 'center', padding: '50px 0', fontFamily: 'var(--font-ui)', fontWeight: 300 }}>
            No customer orders placed yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
