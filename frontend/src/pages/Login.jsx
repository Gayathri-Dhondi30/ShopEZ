import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
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
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const user = await login(email, password);

      // Automatic routing based on role
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/products');
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
        boxShadow: '0 10px 40px rgba(0,0,0,0.8)'
      }}>
        <h2 style={{
          textAlign: 'center',
          fontSize: '1.8rem',
          color: '#ffffff',
          marginBottom: '30px'
        }}>
          Login <span style={{ color: 'var(--gold-accent)' }}>ShopEZ</span>
        </h2>

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
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--secondary-text)', fontFamily: 'var(--font-ui)' }}>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              placeholder="e.g. john@example.com"
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
            {loading ? 'Verifying Session...' : 'Login'}
          </button>
        </form>

        <p style={{
          textAlign: 'center',
          marginTop: '24px',
          fontSize: '0.9rem',
          color: 'var(--secondary-text)',
          fontFamily: 'var(--font-ui)'
        }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--gold-accent)', fontWeight: 600 }}>Register now</Link>
        </p>

        <div style={{
          textAlign: 'center',
          marginTop: '25px',
          borderTop: '1px solid var(--glass-border)',
          paddingTop: '20px'
        }}>
          <Link to="/admin-login" style={{
            fontSize: '0.85rem',
            color: 'var(--gold-accent)',
            fontFamily: 'var(--font-ui)',
            opacity: 0.8,
            transition: 'var(--transition)'
          }} onMouseOver={(e) => { e.currentTarget.style.opacity = '1'; }} onMouseOut={(e) => { e.currentTarget.style.opacity = '0.8'; }}>
            Access Administrator Dashboard Panel
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
