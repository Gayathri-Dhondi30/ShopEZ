import React, { useState, useEffect } from 'react';
import api from '../api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [frequentlyViewed, setFrequentlyViewed] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, viewedRes, activitiesRes] = await Promise.all([
        api.get('/admin/dashboard'),
        api.get('/admin/frequently-viewed'),
        api.get('/admin/recent-cart-activities')
      ]);

      setStats(statsRes.data);
      setFrequentlyViewed(viewedRes.data);
      setRecentActivities(activitiesRes.data);
    } catch (error) {
      console.error('Error fetching dashboard statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

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
        Assembling Admin Metrics...
      </div>
    );
  }

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
        Executive <span style={{ color: 'var(--gold-accent)' }}>Dashboard</span>
      </h2>

      {/* Statistics Cards Grid */}
      {stats && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '25px',
          marginBottom: '50px'
        }}>
          {/* Stat Card 1: Users */}
          <div className="glass-card" style={{ padding: '25px', background: 'rgba(28, 18, 13, 0.45)' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--secondary-text)', textTransform: 'uppercase', fontFamily: 'var(--font-ui)', letterSpacing: '1px' }}>Total Customers</span>
            <div style={{ fontSize: '2.2rem', fontWeight: 700, color: '#ffffff', marginTop: '10px', fontFamily: 'var(--font-ui)' }}>
              {stats.totalUsers}
            </div>
          </div>

          {/* Stat Card 2: Products */}
          <div className="glass-card" style={{ padding: '25px', background: 'rgba(28, 18, 13, 0.45)' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--secondary-text)', textTransform: 'uppercase', fontFamily: 'var(--font-ui)', letterSpacing: '1px' }}>Total Products</span>
            <div style={{ fontSize: '2.2rem', fontWeight: 700, color: '#ffffff', marginTop: '10px', fontFamily: 'var(--font-ui)' }}>
              {stats.totalProducts}
            </div>
          </div>

          {/* Stat Card 3: Orders */}
          <div className="glass-card" style={{ padding: '25px', background: 'rgba(28, 18, 13, 0.45)' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--secondary-text)', textTransform: 'uppercase', fontFamily: 'var(--font-ui)', letterSpacing: '1px' }}>Orders Processed</span>
            <div style={{ fontSize: '2.2rem', fontWeight: 700, color: '#ffffff', marginTop: '10px', fontFamily: 'var(--font-ui)' }}>
              {stats.totalOrders}
            </div>
          </div>

          {/* Stat Card 4: Revenue */}
          <div className="glass-card" style={{ padding: '25px', background: 'rgba(28, 18, 13, 0.45)', border: '1px solid rgba(212, 163, 115, 0.3)' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--gold-accent)', textTransform: 'uppercase', fontFamily: 'var(--font-ui)', letterSpacing: '1px' }}>Total Revenue</span>
            <div style={{ fontSize: '2.2rem', fontWeight: 700, color: 'var(--gold-accent)', marginTop: '10px', fontFamily: 'var(--font-ui)' }}>
              ₹{stats.totalRevenue.toFixed(2)}
            </div>
          </div>
        </div>
      )}

      {/* Tables Grid Layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))',
        gap: '40px'
      }}>
        {/* Table 1: Frequently Viewed Products */}
        <div className="glass-card" style={{ padding: '30px' }}>
          <h3 style={{ fontSize: '1.25rem', color: 'var(--gold-accent)', marginBottom: '20px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '10px' }}>
            Frequently Viewed Products
          </h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--secondary-text)' }}>
                <th style={{ padding: '12px 8px', fontWeight: 500 }}>Preview</th>
                <th style={{ padding: '12px 8px', fontWeight: 500 }}>Name</th>
                <th style={{ padding: '12px 8px', fontWeight: 500 }}>Category</th>
                <th style={{ padding: '12px 8px', fontWeight: 500, textAlign: 'right' }}>View Count</th>
              </tr>
            </thead>
            <tbody>
              {frequentlyViewed.map((prod) => (
                <tr key={prod._id} style={{ borderBottom: '1px solid rgba(212, 163, 115, 0.05)', transition: 'var(--transition)' }} onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(212, 163, 115, 0.02)'; }} onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; }}>
                  <td style={{ padding: '8px' }}>
                    <img src={prod.image} alt={prod.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--glass-border)' }} />
                  </td>
                  <td style={{ padding: '8px', color: '#ffffff', fontWeight: 500 }}>{prod.name}</td>
                  <td style={{ padding: '8px', color: 'var(--secondary-text)' }}>{prod.category}</td>
                  <td style={{ padding: '8px', textAlign: 'right', fontWeight: 600, color: 'var(--gold-accent)' }}>{prod.views || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table 2: Recently Added To Cart Activities */}
        <div className="glass-card" style={{ padding: '30px' }}>
          <h3 style={{ fontSize: '1.25rem', color: 'var(--gold-accent)', marginBottom: '20px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '10px' }}>
            Recently Added To Cart
          </h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--secondary-text)' }}>
                <th style={{ padding: '12px 8px', fontWeight: 500 }}>User Name</th>
                <th style={{ padding: '12px 8px', fontWeight: 500 }}>Product Name</th>
                <th style={{ padding: '12px 8px', fontWeight: 500 }}>Quantity</th>
                <th style={{ padding: '12px 8px', fontWeight: 500, textAlign: 'right' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentActivities.map((act) => (
                <tr key={act._id} style={{ borderBottom: '1px solid rgba(212, 163, 115, 0.05)', transition: 'var(--transition)' }} onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(212, 163, 115, 0.02)'; }} onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; }}>
                  <td style={{ padding: '12px 8px', color: '#ffffff', fontWeight: 500 }}>{act.userId ? act.userId.name : 'Guest User'}</td>
                  <td style={{ padding: '12px 8px', color: 'var(--secondary-text)' }}>{act.productId ? act.productId.name : 'Unknown Product'}</td>
                  <td style={{ padding: '12px 8px', fontWeight: 600, color: 'var(--gold-accent)' }}>1</td>
                  <td style={{ padding: '12px 8px', textAlign: 'right', fontSize: '0.8rem', color: 'var(--secondary-text)' }}>
                    {new Date(act.date).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
