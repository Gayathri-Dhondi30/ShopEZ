import React, { useState, useEffect } from 'react';
import api from '../api';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    discount: '0',
    category: 'Bags',
    image: '/images/briefcase.png',
    stock: ''
  });

  const categories = ['Bags', 'Wallets', 'Accessories'];
  const defaultImages = [
    { label: 'Briefcase Asset', value: '/images/briefcase.png' },
    { label: 'Wallet Asset', value: '/images/wallet.png' },
    { label: 'Duffle Bag Asset', value: '/images/duffle.png' },
    { label: 'Belt Asset', value: '/images/belt.png' },
    { label: 'Journal Asset', value: '/images/journal.png' },
    { label: 'Card Holder Asset', value: '/images/cardholder.png' }
  ];

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products list:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleResetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      discount: '0',
      category: 'Bags',
      image: '/images/briefcase.png',
      stock: ''
    });
    setIsEditing(false);
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, description, price, discount, category, image, stock } = formData;

    if (!name || !description || !price || stock === '') {
      alert('Please fill in all product fields.');
      return;
    }

    try {
      if (isEditing) {
        await api.put(`/products/${editId}`, {
          name,
          description,
          price: Number(price),
          discount: Number(discount),
          category,
          image,
          stock: Number(stock)
        });
        alert('Product updated successfully.');
      } else {
        await api.post('/products', {
          name,
          description,
          price: Number(price),
          discount: Number(discount),
          category,
          image,
          stock: Number(stock)
        });
        alert('Product added successfully.');
      }
      handleResetForm();
      fetchProducts();
    } catch (error) {
      alert(error.response?.data?.message || 'Error processing product.');
    }
  };

  const handleEditClick = (prod) => {
    setIsEditing(true);
    setEditId(prod._id);
    setFormData({
      name: prod.name,
      description: prod.description,
      price: prod.price.toString(),
      discount: (prod.discount || 0).toString(),
      category: prod.category,
      image: prod.image,
      stock: prod.stock.toString()
    });
  };

  const handleDeleteClick = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      alert('Product deleted successfully.');
      fetchProducts();
    } catch (error) {
      alert(error.response?.data?.message || 'Error deleting product.');
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
        Manage <span style={{ color: 'var(--gold-accent)' }}>Products</span>
      </h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1.8fr',
        gap: '40px',
        alignItems: 'start'
      }}>
        {/* Left: Add/Edit Product Form */}
        <div className="glass-card" style={{ padding: '30px', background: 'rgba(28, 18, 13, 0.7)' }}>
          <h3 style={{ fontSize: '1.25rem', color: 'var(--gold-accent)', marginBottom: '20px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '10px' }}>
            {isEditing ? 'Modify Leather Asset' : 'Register New Leather Asset'}
          </h3>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--secondary-text)', fontFamily: 'var(--font-ui)' }}>Product Title</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className="form-input" placeholder="e.g. Vintage Leather Jacket" required />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--secondary-text)', fontFamily: 'var(--font-ui)' }}>Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} className="form-input" placeholder="Craftsmanship details, linings, material specs..." style={{ minHeight: '90px', resize: 'vertical' }} required />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--secondary-text)', fontFamily: 'var(--font-ui)' }}>Price (₹)</label>
                <input type="number" name="price" value={formData.price} onChange={handleChange} className="form-input" placeholder="250.00" min="0" step="0.01" required />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--secondary-text)', fontFamily: 'var(--font-ui)' }}>Discount (%)</label>
                <input type="number" name="discount" value={formData.discount} onChange={handleChange} className="form-input" placeholder="10" min="0" max="100" />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--secondary-text)', fontFamily: 'var(--font-ui)' }}>Category</label>
                <select name="category" value={formData.category} onChange={handleChange} className="form-input" style={{ background: '#1c120d' }}>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--secondary-text)', fontFamily: 'var(--font-ui)' }}>Stock Level</label>
                <input type="number" name="stock" value={formData.stock} onChange={handleChange} className="form-input" placeholder="25" min="0" required />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--secondary-text)', fontFamily: 'var(--font-ui)' }}>Select Image Asset</label>
              <select name="image" value={formData.image} onChange={handleChange} className="form-input" style={{ background: '#1c120d' }}>
                {defaultImages.map(img => <option key={img.value} value={img.value}>{img.label} ({img.value})</option>)}
              </select>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
              <button type="submit" className="btn-primary" style={{ flexGrow: 1, padding: '10px 0', fontSize: '0.8rem' }}>
                {isEditing ? 'Update Product' : 'Add Product'}
              </button>
              {isEditing && (
                <button type="button" onClick={handleResetForm} className="btn-secondary" style={{ padding: '10px 20px', fontSize: '0.8rem' }}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Right: Products List */}
        <div className="glass-card" style={{ padding: '30px' }}>
          <h3 style={{ fontSize: '1.25rem', color: 'var(--gold-accent)', marginBottom: '20px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '10px' }}>
            Products Inventory
          </h3>

          {loading ? (
            <div style={{ color: 'var(--gold-accent)', textAlign: 'center', padding: '40px 0', fontFamily: 'var(--font-ui)' }}>
              Loading Products Inventory...
            </div>
          ) : products.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxHeight: '550px', overflowY: 'auto', paddingRight: '8px' }}>
              {products.map((prod) => (
                <div key={prod._id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '15px',
                  border: '1px solid var(--glass-border)',
                  borderRadius: '8px',
                  gap: '15px',
                  background: 'rgba(15, 11, 8, 0.4)'
                }}>
                  <img src={prod.image} alt={prod.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--glass-border)' }} />
                  <div style={{ flexGrow: 1 }}>
                    <h4 style={{ fontSize: '0.95rem', color: '#ffffff', fontFamily: 'var(--font-ui)', fontWeight: 500 }}>{prod.name}</h4>
                    <div style={{ display: 'flex', gap: '10px', fontSize: '0.8rem', color: 'var(--secondary-text)', marginTop: '2px', fontFamily: 'var(--font-ui)' }}>
                      <span>Price: <strong style={{ color: 'var(--gold-accent)' }}>₹{prod.price.toFixed(2)}</strong></span>
                      <span>Stock: <strong>{prod.stock}</strong></span>
                      {prod.discount > 0 && <span>Disc: <strong>-{prod.discount}%</strong></span>}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => handleEditClick(prod)} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.7rem' }}>Edit</button>
                    <button onClick={() => handleDeleteClick(prod._id)} className="btn-danger" style={{ padding: '6px 12px', fontSize: '0.7rem' }}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ color: 'var(--secondary-text)', textAlign: 'center', padding: '40px 0', fontFamily: 'var(--font-ui)', fontWeight: 300 }}>
              No products found in database.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;
