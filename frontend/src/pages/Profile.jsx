import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Profile = () => {
  const { user } = useContext(AuthContext);

  if (!user) return null;

  return (
    <div className="page-container animated-fade" style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: '120px'
    }}>
      <div className="glass-card" style={{
        width: '100%',
        maxWidth: '550px',
        padding: '50px 40px',
        background: 'linear-gradient(135deg, rgba(28, 18, 13, 0.8) 0%, rgba(15, 11, 8, 0.8) 100%)',
        textAlign: 'center'
      }}>
        {/* User Avatar Initials */}
        <div style={{
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--primary-brown) 0%, var(--gold-accent) 100%)',
          color: '#ffffff',
          fontSize: '2.5rem',
          fontWeight: 600,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          margin: '0 auto 25px',
          boxShadow: '0 0 20px rgba(212, 163, 115, 0.4)',
          fontFamily: 'var(--font-display)'
        }}>
          {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
        </div>

        {/* Name and Email */}
        <h2 style={{ fontSize: '2rem', color: '#ffffff', marginBottom: '8px' }}>{user.name}</h2>
        <p style={{
          color: 'var(--gold-accent)',
          fontFamily: 'var(--font-ui)',
          fontSize: '1rem',
          marginBottom: '35px',
          opacity: 0.9
        }}>
          {user.email}
        </p>

        {/* Profile Attributes Metadata */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '20px',
          padding: '25px 0',
          borderTop: '1px solid var(--glass-border)',
          borderBottom: '1px solid var(--glass-border)',
          marginBottom: '40px',
          fontFamily: 'var(--font-ui)',
          fontSize: '0.95rem'
        }}>
          <div style={{ textAlign: 'left' }}>
            <span style={{ color: 'var(--secondary-text)', opacity: 0.6, fontSize: '0.85rem', display: 'block', marginBottom: '4px' }}>ACCOUNT ROLE</span>
            <span style={{
              background: 'rgba(212, 163, 115, 0.15)',
              color: 'var(--gold-accent)',
              padding: '3px 12px',
              borderRadius: '12px',
              fontSize: '0.75rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              border: '1px solid var(--glass-border)'
            }}>
              {user.role}
            </span>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ color: 'var(--secondary-text)', opacity: 0.6, fontSize: '0.85rem', display: 'block', marginBottom: '4px' }}>MEMBER SINCE</span>
            <span style={{ color: '#ffffff', fontWeight: 500 }}>
              July 2026
            </span>
          </div>
        </div>

        {/* Quick Links Navigations */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '15px'
        }}>
          <Link to="/orders" className="btn-primary" style={{ padding: '12px 0', fontSize: '0.85rem' }}>
            View Orders
          </Link>
          <Link to="/products" className="btn-secondary" style={{ padding: '12px 0', fontSize: '0.85rem' }}>
            Continue Shop
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Profile;
