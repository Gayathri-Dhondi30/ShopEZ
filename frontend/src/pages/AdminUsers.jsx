import React, { useState, useEffect } from 'react';
import api from '../api';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users list:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (id, name) => {
    if (!window.confirm(`Are you absolutely sure you want to permanently delete user "${name}"? This action cannot be undone.`)) return;
    try {
      await api.delete(`/admin/users/${id}`);
      alert(`User "${name}" has been deleted.`);
      fetchUsers();
    } catch (error) {
      alert(error.response?.data?.message || 'Error deleting user.');
    }
  };

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
        Manage <span style={{ color: 'var(--gold-accent)' }}>Users</span>
      </h2>

      <div className="glass-card" style={{ padding: '30px', background: 'rgba(28, 18, 13, 0.45)' }}>
        <h3 style={{ fontSize: '1.25rem', color: 'var(--gold-accent)', marginBottom: '20px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '10px' }}>
          Registered Customers
        </h3>

        {loading ? (
          <div style={{ color: 'var(--gold-accent)', textAlign: 'center', padding: '50px 0', fontFamily: 'var(--font-ui)' }}>
            Retrieving Customer Accounts...
          </div>
        ) : users.length > 0 ? (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.95rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--secondary-text)' }}>
                <th style={{ padding: '12px 10px', fontWeight: 500 }}>Customer Name</th>
                <th style={{ padding: '12px 10px', fontWeight: 500 }}>Email Address</th>
                <th style={{ padding: '12px 10px', fontWeight: 500 }}>Registered Date</th>
                <th style={{ padding: '12px 10px', fontWeight: 500, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} style={{ borderBottom: '1px solid rgba(212, 163, 115, 0.05)', transition: 'var(--transition)' }} onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(212, 163, 115, 0.02)'; }} onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; }}>
                  <td style={{ padding: '15px 10px', color: '#ffffff', fontWeight: 500 }}>{u.name}</td>
                  <td style={{ padding: '15px 10px', color: 'var(--secondary-text)' }}>{u.email}</td>
                  <td style={{ padding: '15px 10px', color: 'var(--secondary-text)', fontSize: '0.85rem', fontFamily: 'var(--font-ui)' }}>
                    {new Date(u.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </td>
                  <td style={{ padding: '15px 10px', textAlign: 'right' }}>
                    <button
                      onClick={() => handleDeleteUser(u._id, u.name)}
                      className="btn-danger"
                      style={{
                        padding: '6px 14px',
                        fontSize: '0.75rem',
                        borderRadius: '6px'
                      }}
                    >
                      Delete Account
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div style={{ color: 'var(--secondary-text)', textAlign: 'center', padding: '50px 0', fontFamily: 'var(--font-ui)', fontWeight: 300 }}>
            No registered customers found.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
