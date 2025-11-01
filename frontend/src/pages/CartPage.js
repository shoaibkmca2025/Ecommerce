import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaTrash, FaMinus, FaPlus, FaArrowLeft } from 'react-icons/fa';
import { CartContext } from '../context/CartContext';
import './CartPage.css';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useContext(CartContext);

  const handleQuantityChange = (item, newQuantity) => {
    if (newQuantity > 0 && newQuantity <= item.countInStock) {
      updateQuantity(item._id, newQuantity);
    }
  };

  return (
    <motion.div 
      className="cart-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="container">
        <h1 className="page-title">Your Shopping Cart</h1>
        
        {cartItems.length === 0 ? (
          <motion.div 
            className="empty-cart"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added any products to your cart yet.</p>
            <Link to="/products" className="continue-shopping">
              <FaArrowLeft /> Continue Shopping
            </Link>
          </motion.div>
        ) : (
          <div className="cart-container">
            <div className="cart-items">
              <div className="cart-header">
                <span className="product-col">Product</span>
                <span className="price-col">Price</span>
                <span className="quantity-col">Quantity</span>
                <span className="total-col">Total</span>
                <span className="action-col">Action</span>
              </div>
              
              {cartItems.map((item, index) => (
                <motion.div 
                  className="cart-item"
                  key={item._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <div className="product-col">
                    <div className="product-info">
                      <img className="cart-item-image" src={item.image} alt={item.name} />
                      <div>
                        <h3>{item.name}</h3>
                        <p>{item.category}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="price-col">₹{item.price.toFixed(2)}</div>
                  
                  <div className="quantity-col">
                    <div className="quantity-selector">
                      <button 
                        onClick={() => handleQuantityChange(item, item.quantity - 1)}
                        disabled={item.quantity === 1}
                      >
                        <FaMinus />
                      </button>
                      <span>{item.quantity}</span>
                      <button 
                        onClick={() => handleQuantityChange(item, item.quantity + 1)}
                        disabled={item.quantity === item.countInStock}
                      >
                        <FaPlus />
                      </button>
                    </div>
                  </div>
                  
                  <div className="total-col">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </div>
                  
                  <div className="action-col">
                    <motion.button 
                      className="remove-btn"
                      onClick={() => removeFromCart(item._id)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <FaTrash />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <motion.div 
              className="cart-summary"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2>Order Summary</h2>
              <div className="summary-row">
                <span>Subtotal</span>
                <span>₹{cartTotal.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>₹{cartTotal > 0 ? '100.00' : '0.00'}</span>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span>₹{cartTotal > 0 ? (cartTotal + 100).toFixed(2) : '0.00'}</span>
              </div>
              
              <Link to="/checkout" className="checkout-btn">
                Proceed to Checkout
              </Link>
              
              <Link to="/products" className="continue-shopping">
                <FaArrowLeft /> Continue Shopping
              </Link>
            </motion.div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CartPage;