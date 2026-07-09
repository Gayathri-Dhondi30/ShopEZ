import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="page-container animated-fade" style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      gap: '40px',
      paddingTop: '120px'
    }}>
      {/* Hero Banner Section */}
      <div className="glass-card" style={{
        width: '100%',
        padding: '80px 40px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, rgba(28, 18, 13, 0.9) 0%, rgba(15, 11, 8, 0.9) 100%)',
        border: '1px solid rgba(212, 163, 115, 0.25)',
        boxShadow: '0 15px 40px rgba(0, 0, 0, 0.8)'
      }}>
        <h1 style={{
          fontSize: '3.5rem',
          fontWeight: 700,
          color: '#ffffff',
          marginBottom: '20px',
          textShadow: '0 2px 10px rgba(0, 0, 0, 0.8)',
          lineHeight: '1.2'
        }}>
          SHOPEZ <span style={{ color: 'var(--gold-accent)' }}>LUXURY</span>
        </h1>
        <p style={{
          fontSize: '1.25rem',
          color: 'var(--secondary-text)',
          maxWidth: '650px',
          marginBottom: '40px',
          fontFamily: 'var(--font-ui)',
          fontWeight: 300,
          letterSpacing: '1px'
        }}>
          Handcrafted leather products designed for timeless style, premium durability, and exquisite sophistication.
        </p>
        <div style={{ display: 'flex', gap: '20px' }}>
          <Link to="/products" className="btn-primary" style={{ padding: '14px 35px', fontSize: '0.95rem' }}>
            Explore Collection
          </Link>
          <Link to="/login" className="btn-secondary" style={{ padding: '14px 35px', fontSize: '0.95rem' }}>
            Sign In
          </Link>
        </div>
      </div>

      {/* Featured Highlights */}
      <div style={{
        width: '100%',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '30px',
        marginTop: '20px'
      }}>
        <div className="glass-card" style={{ padding: '40px 30px', textAlign: 'left' }}>
          <div style={{ color: 'var(--gold-accent)', fontSize: '2.5rem', marginBottom: '15px', fontFamily: 'var(--font-display)' }}>01</div>
          <h3 style={{ color: '#ffffff', fontSize: '1.3rem', marginBottom: '10px' }}>Premium Briefcases</h3>
          <p style={{ color: 'var(--secondary-text)', fontSize: '0.95rem', fontWeight: 300 }}>
            Indulge in Italian leather briefcases crafted with brass locks, padded dividers, and hand-finished stitch accents.
          </p>
        </div>
        <div className="glass-card" style={{ padding: '40px 30px', textAlign: 'left' }}>
          <div style={{ color: 'var(--gold-accent)', fontSize: '2.5rem', marginBottom: '15px', fontFamily: 'var(--font-display)' }}>02</div>
          <h3 style={{ color: '#ffffff', fontSize: '1.3rem', marginBottom: '10px' }}>Exquisite Wallets</h3>
          <p style={{ color: 'var(--secondary-text)', fontSize: '0.95rem', fontWeight: 300 }}>
            Slim RFID-blocking bifold wallets and card holders tailored for ultimate comfort, accessibility, and elegance.
          </p>
        </div>
        <div className="glass-card" style={{ padding: '40px 30px', textAlign: 'left' }}>
          <div style={{ color: 'var(--gold-accent)', fontSize: '2.5rem', marginBottom: '15px', fontFamily: 'var(--font-display)' }}>03</div>
          <h3 style={{ color: '#ffffff', fontSize: '1.3rem', marginBottom: '10px' }}>Luxury Accessories</h3>
          <p style={{ color: 'var(--secondary-text)', fontSize: '0.95rem', fontWeight: 300 }}>
            Handcrafted journals, belts, and key loops made using durable vegetable-tanned leather that patinas beautifully over time.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
