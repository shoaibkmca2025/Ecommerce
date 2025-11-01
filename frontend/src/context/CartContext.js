import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);

  // Load cart from localStorage on initial render
  useEffect(() => {
    const cartFromStorage = localStorage.getItem('cartItems')
      ? JSON.parse(localStorage.getItem('cartItems'))
      : [];
    
    setCartItems(cartFromStorage);
  }, []);

  // Update cart total whenever cartItems changes
  useEffect(() => {
    const total = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
    setCartTotal(total);
    
    // Save to localStorage
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  // Add item to cart
  const addToCart = (product, qty = 1) => {
    const existItem = cartItems.find(item => item._id === product._id);
    
    if (existItem) {
      setCartItems(
        cartItems.map(item =>
          item._id === product._id ? { ...item, qty: item.qty + qty } : item
        )
      );
    } else {
      setCartItems([...cartItems, { ...product, qty }]);
    }
  };

  // Remove item from cart
  const removeFromCart = (id) => {
    setCartItems(cartItems.filter(item => item._id !== id));
  };

  // Update item quantity
  const updateQuantity = (id, qty) => {
    setCartItems(
      cartItems.map(item => (item._id === id ? { ...item, qty } : item))
    );
  };

  // Clear cart
  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartTotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};