import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AdminLogin = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    if (!email || !password) {
      setError('Please provide administrative credentials.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const user = await login(email, password);

      if (user.role !== 'admin') {
        setError('Access denied: Unauthorized account role.');
        // We log them out since they are not admin but logged in on admin screen
        // Wait, it is safer to just throw error so they can sign in with correct account
      } else {
        navigate('/admin/dashboard');
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container animated-fade" style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: '100px'
    }}>
      <div className="glass-card" style={{
        width: '100%',
        maxWidth: '430px',
        padding: '40px 30px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.8)',
        border: '1px solid rgba(212, 163, 115, 0.3)'
      }}>
        <h2 style={{
          textAlign: 'center',
          fontSize: '1.6rem',
          color: '#ffffff',
          marginBottom: '8px'
        }}>
          ADMINISTRATION <span style={{ color: 'var(--gold-accent)' }}>PANEL</span>
        </h2>
        <p style={{
          textAlign: 'center',
          color: 'var(--secondary-text)',
          fontSize: '0.85rem',
          fontFamily: 'var(--font-ui)',
          marginBottom: '30px',
          opacity: 0.8
        }}>
          ShopEZ Luxury Administrator Gateway
        </p>

        {error && (
          <div style={{
            background: 'rgba(231, 76, 60, 0.12)',
            border: '1px solid rgba(231, 76, 60, 0.3)',
            color: '#e74c3c',
            borderRadius: '6px',
            padding: '10px 15px',
            fontSize: '0.85rem',
            marginBottom: '20px',
            fontFamily: 'var(--font-ui)'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--secondary-text)', fontFamily: 'var(--font-ui)' }}>Admin Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              placeholder="admin@shopez.com"
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--secondary-text)', fontFamily: 'var(--font-ui)' }}>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-input"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{ width: '100%', marginTop: '10px' }}
            disabled={loading}
          >
            {loading ? 'Authenticating Authority...' : 'Admin Login'}
          </button>
        </form>

        <div style={{
          textAlign: 'center',
          marginTop: '25px',
          borderTop: '1px solid var(--glass-border)',
          paddingTop: '20px'
        }}>
          <Link to="/login" style={{
            fontSize: '0.85rem',
            color: 'var(--secondary-text)',
            fontFamily: 'var(--font-ui)',
            opacity: 0.8,
            transition: 'var(--transition)'
          }} onMouseOver={(e) => { e.currentTarget.style.color = 'var(--gold-accent)'; }} onMouseOut={(e) => { e.currentTarget.style.color = 'var(--secondary-text)'; }}>
            Return to Regular Client Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
