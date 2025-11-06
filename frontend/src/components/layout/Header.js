import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaShoppingCart, FaUser, FaBars, FaTimes, FaBox } from 'react-icons/fa';
import { AuthContext } from '../../context/AuthContext';
import { CartContext } from '../../context/CartContext';
import './Header.css';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: 'spring', 
        stiffness: 100,
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 }
  };

  const logoVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        type: 'spring', 
        stiffness: 200,
        duration: 0.7
      }
    }
  };

  return (
    <header className="header">
      <div className="container header-container">
        <motion.div 
          className="logo"
          initial="hidden"
          animate="visible"
          variants={logoVariants}
        >
          <Link to="/">
            <h1>Cherish<span>India</span></h1>
          </Link>
        </motion.div>

        <div className="mobile-toggle" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <FaTimes /> : <FaBars />}
        </div>

        <motion.nav 
          className={`nav ${isOpen ? 'show' : ''}`}
          initial="hidden"
          animate="visible"
          variants={navVariants}
        >
          <motion.div variants={itemVariants} className="nav-item">
            <Link to="/" onClick={() => setIsOpen(false)}>Home</Link>
          </motion.div>
          <motion.div variants={itemVariants} className="nav-item">
            <Link to="/products" onClick={() => setIsOpen(false)}>Products</Link>
          </motion.div>
          
          {user ? (
              <motion.div variants={itemVariants} className="nav-item user-menu">
                <span className="user-name">
                  <FaUser /> {user.name}
                </span>
                <div className="dropdown">
                  <Link to="/orders" onClick={() => setIsOpen(false)}>
                    <FaBox /> My Orders
                  </Link>
                  {user.isAdmin && (
                    <Link to="/admin/orders" onClick={() => setIsOpen(false)}>
                      <FaBox /> Admin Orders
                    </Link>
                  )}
                  <button onClick={handleLogout}>Logout</button>
                </div>
              </motion.div>
          ) : (
            <motion.div variants={itemVariants} className="nav-item">
              <Link to="/login" onClick={() => setIsOpen(false)}>Login</Link>
            </motion.div>
          )}
          
          <motion.div 
            variants={itemVariants} 
            className="nav-item cart-icon"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Link to="/cart" onClick={() => setIsOpen(false)}>
              <FaShoppingCart />
              {cartItems.length > 0 && (
                <motion.span 
                  className="cart-badge"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500 }}
                >
                  {cartItems.reduce((acc, item) => acc + item.qty, 0)}
                </motion.span>
              )}
            </Link>
          </motion.div>
        </motion.nav>
      </div>
    </header>
  );
};

export default Header;