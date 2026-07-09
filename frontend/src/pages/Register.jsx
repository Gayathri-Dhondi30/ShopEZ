import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword } = formData;

    if (!name || !email || !password || !confirmPassword) {
      setError('All input fields are required.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await register(name, email, password, confirmPassword);
      setSuccess('Account created successfully! Redirecting to login page...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
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
        maxWidth: '460px',
        padding: '40px 30px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.8)'
      }}>
        <h2 style={{
          textAlign: 'center',
          fontSize: '1.8rem',
          color: '#ffffff',
          marginBottom: '30px'
        }}>
          Register <span style={{ color: 'var(--gold-accent)' }}>ShopEZ</span>
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

        {success && (
          <div style={{
            background: 'rgba(46, 204, 113, 0.12)',
            border: '1px solid rgba(46, 204, 113, 0.3)',
            color: '#2ecc71',
            borderRadius: '6px',
            padding: '10px 15px',
            fontSize: '0.85rem',
            marginBottom: '20px',
            fontFamily: 'var(--font-ui)'
          }}>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--secondary-text)', fontFamily: 'var(--font-ui)' }}>Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-input"
              placeholder="e.g. John Doe"
              required
            />
          </div>

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

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--secondary-text)', fontFamily: 'var(--font-ui)' }}>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
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
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <p style={{
          textAlign: 'center',
          marginTop: '24px',
          fontSize: '0.9rem',
          color: 'var(--secondary-text)',
          fontFamily: 'var(--font-ui)'
        }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--gold-accent)', fontWeight: 600 }}>Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
