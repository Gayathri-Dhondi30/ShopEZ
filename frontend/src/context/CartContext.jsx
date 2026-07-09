import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    if (!user || user.role === 'admin') return;
    setLoading(true);
    try {
      const response = await api.get(`/cart/${user._id}`);
      setCartItems(response.data);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role !== 'admin') {
      fetchCart();
    } else {
      setCartItems([]);
    }
  }, [user]);

  const addToCart = async (productId, quantity = 1) => {
    try {
      await api.post('/cart/add', { productId, quantity });
      await fetchCart();
    } catch (error) {
      throw error.response?.data?.message || 'Error adding product to cart';
    }
  };

  const removeFromCart = async (cartItemId) => {
    try {
      await api.delete(`/cart/remove/${cartItemId}`);
      setCartItems((prev) => prev.filter((item) => item._id !== cartItemId));
    } catch (error) {
      throw error.response?.data?.message || 'Error removing item from cart';
    }
  };

  const updateQuantity = async (cartItemId, quantity) => {
    try {
      await api.put(`/cart/update/${cartItemId}`, { quantity });
      setCartItems((prev) =>
        prev.map((item) => (item._id === cartItemId ? { ...item, quantity: Number(quantity) } : item))
      );
    } catch (error) {
      throw error.response?.data?.message || 'Error updating cart quantity';
    }
  };

  const clearCartState = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const product = item.productId;
      if (!product) return total;
      const discountedPrice = product.price * (1 - (product.discount || 0) / 100);
      return total + discountedPrice * item.quantity;
    }, 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        fetchCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCartState,
        getCartTotal,
        getCartCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
