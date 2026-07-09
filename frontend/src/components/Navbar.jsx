import React, { useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { getCartCount } = useContext(CartContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const activeStyle = ({ isActive }) => ({
    color: isActive ? 'var(--gold-accent)' : 'var(--secondary-text)',
    borderBottom: isActive ? '2px solid var(--gold-accent)' : 'none',
    paddingBottom: '4px'
  });

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '70px',
      background: 'rgba(15, 11, 8, 0.85)',
      backdropFilter: 'blur(15px)',
      webkitBackdropFilter: 'blur(15px)',
      borderBottom: '1px solid var(--glass-border)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0 5%',
      zIndex: 1000,
      boxShadow: '0 4px 30px rgba(0, 0, 0, 0.5)'
    }}>
      {/* Logo */}
      <Link to="/" style={{
        fontFamily: 'var(--font-display)',
        fontSize: '1.6rem',
        fontWeight: 'bold',
        letterSpacing: '2px',
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <span style={{ color: 'var(--gold-accent)' }}>SHOP</span>EZ
      </Link>

      {/* Navigation Links */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '24px',
        fontFamily: 'var(--font-ui)',
        fontWeight: 500
      }}>
        {user && user.role === 'admin' ? (
          <>
            <NavLink to="/admin/dashboard" style={activeStyle}>Dashboard</NavLink>
            <NavLink to="/admin/products" style={activeStyle}>Products</NavLink>
            <NavLink to="/admin/users" style={activeStyle}>Users</NavLink>
            <NavLink to="/admin/orders" style={activeStyle}>Orders</NavLink>
            <NavLink to="/products" style={{ ...activeStyle({ isActive: false }), opacity: 0.8 }}>Shop View</NavLink>
          </>
        ) : (
          <>
            <NavLink to="/" style={activeStyle}>Home</NavLink>
            <NavLink to="/products" style={activeStyle}>Shop</NavLink>
            <NavLink to="/cart" style={activeStyle} className="nav-cart-link">
              Cart 
              {getCartCount() > 0 && (
                <span style={{
                  marginLeft: '6px',
                  background: 'var(--gold-accent)',
                  color: 'var(--bg-color)',
                  borderRadius: '50%',
                  padding: '2px 7px',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  boxShadow: '0 0 10px var(--gold-accent)',
                  display: 'inline-block',
                  verticalAlign: 'middle',
                  lineHeight: '1'
                }}>
                  {getCartCount()}
                </span>
              )}
            </NavLink>
            {user && (
              <>
                <NavLink to="/orders" style={activeStyle}>Orders</NavLink>
                <NavLink to="/profile" style={activeStyle}>Profile</NavLink>
              </>
            )}
          </>
        )}
      </div>

      {/* Auth Actions */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '15px'
      }}>
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span style={{
              color: 'var(--secondary-text)',
              fontSize: '0.9rem',
              fontFamily: 'var(--font-ui)'
            }}>
              Hello, <strong style={{ color: '#ffffff' }}>{user.name.split(' ')[0]}</strong>
            </span>
            <button 
              onClick={handleLogout}
              className="btn-secondary"
              style={{
                padding: '6px 16px',
                fontSize: '0.8rem'
              }}
            >
              Logout
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '10px' }}>
            <Link to="/login" className="btn-secondary" style={{ padding: '6px 16px', fontSize: '0.8rem' }}>Login</Link>
            <Link to="/register" className="btn-primary" style={{ padding: '7px 18px', fontSize: '0.8rem' }}>Register</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
