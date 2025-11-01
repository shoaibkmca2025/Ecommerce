import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  const footerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.footer 
      className="footer"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={footerVariants}
    >
      <div className="container footer-container">
        <motion.div className="footer-section" variants={itemVariants}>
          <h3>Cherish<span>India</span></h3>
          <p>Self Goodness, Better World</p>
          <div className="social-icons">
            <motion.a 
              href="#" 
              whileHover={{ scale: 1.2, color: '#1877f2' }}
              whileTap={{ scale: 0.9 }}
            >
              <FaFacebook />
            </motion.a>
            <motion.a 
              href="#" 
              whileHover={{ scale: 1.2, color: '#1da1f2' }}
              whileTap={{ scale: 0.9 }}
            >
              <FaTwitter />
            </motion.a>
            <motion.a 
              href="#" 
              whileHover={{ scale: 1.2, color: '#e4405f' }}
              whileTap={{ scale: 0.9 }}
            >
              <FaInstagram />
            </motion.a>
            <motion.a 
              href="#" 
              whileHover={{ scale: 1.2, color: '#0077b5' }}
              whileTap={{ scale: 0.9 }}
            >
              <FaLinkedin />
            </motion.a>
          </div>
        </motion.div>

        <motion.div className="footer-section" variants={itemVariants}>
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/products">Products</Link></li>
            <li><Link to="/cart">Cart</Link></li>
            <li><Link to="/login">Login</Link></li>
          </ul>
        </motion.div>

        <motion.div className="footer-section" variants={itemVariants}>
          <h4>Contact Us</h4>
          <p>123 Commerce Street</p>
          <p>New Delhi, India</p>
          <p>Email: info@cherishindia.com</p>
          <p>Phone: +91 123 456 7890</p>
        </motion.div>

        <motion.div className="footer-section" variants={itemVariants}>
          <h4>Newsletter</h4>
          <p>Subscribe to our newsletter for updates</p>
          <form className="newsletter-form">
            <input type="email" placeholder="Your email" />
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Subscribe
            </motion.button>
          </form>
        </motion.div>
      </div>
      
      <motion.div 
        className="footer-bottom"
        variants={itemVariants}
      >
        <p>&copy; {new Date().getFullYear()} CherishIndia. All rights reserved.</p>
      </motion.div>
    </motion.footer>
  );
};

export default Footer;