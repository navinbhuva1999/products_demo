'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { authState } = useAuth();
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    if (authState.isAuthenticated) {
      const cartsData = localStorage.getItem('cartItems');
      if (cartsData) {
        setCartItems(JSON.parse(cartsData));
      }
    } else {
      setCartItems([]);
      localStorage.removeItem('cartItems');
    }
  }, [authState.isAuthenticated]);

  useEffect(() => {
    if (authState.isAuthenticated) {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }
  }, [cartItems, authState.isAuthenticated]);

  const addToCart = (item) => {
    const eItem = cartItems.find(item => item.id === item.id);
    if (eItem) {
      eItem.quantity = eItem.quantity + 1;
      setCartItems([...cartItems]);
    } else {
      setCartItems([...cartItems, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) {
      removeFromCart(id);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cartItems');
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, getCartTotal }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}; 