import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowRight, FaShippingFast, FaCreditCard, FaHeadset } from 'react-icons/fa';
import './HomePage.css';

// Components
import ProductCard from '../components/products/ProductCard';
import { ProductsContext } from '../context/ProductsContext';

const HomePage = () => {
  const { products, loading } = useContext(ProductsContext);
  
  // Get first 3 products as featured products
  const featuredProducts = products.slice(0, 3);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  };

  const heroVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2
      }
    }
  };

  const heroTextVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  };

  const heroImageVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        delay: 0.2
      }
    }
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <motion.section 
        className="hero-section"
        initial="hidden"
        animate="visible"
        variants={heroVariants}
      >
        <div className="container hero-container">
          <motion.div className="hero-content" variants={heroTextVariants}>
            <h1>Discover Authentic Indian Craftsmanship</h1>
            <p>
              Explore our curated collection of handcrafted products that celebrate
              India's rich cultural heritage while supporting local artisans.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/products" className="btn btn-primary">
                Shop Now <FaArrowRight />
              </Link>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="hero-image"
            variants={heroImageVariants}
          >
            <img 
              src="https://images.unsplash.com/photo-1606722590583-6951b5ea92ad?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2670&q=80" 
              alt="Indian Handicrafts" 
            />
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section 
        className="features-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="container">
          <motion.div className="features-grid" variants={containerVariants}>
            <motion.div className="feature-card" variants={itemVariants}>
              <div className="feature-icon">
                <FaShippingFast />
              </div>
              <h3>Free Shipping</h3>
              <p>On all orders above ₹999</p>
            </motion.div>
            
            <motion.div className="feature-card" variants={itemVariants}>
              <div className="feature-icon">
                <FaCreditCard />
              </div>
              <h3>Secure Payment</h3>
              <p>100% secure payment options</p>
            </motion.div>
            
            <motion.div className="feature-card" variants={itemVariants}>
              <div className="feature-icon">
                <FaHeadset />
              </div>
              <h3>24/7 Support</h3>
              <p>Dedicated customer support</p>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Featured Products Section */}
      <motion.section 
        className="featured-products section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="container">
          <motion.h2 
            className="section-title"
            variants={itemVariants}
          >
            Featured Products
          </motion.h2>
          
          <motion.div 
            className="products-grid"
            variants={containerVariants}
          >
            {featuredProducts.map(product => (
              <motion.div key={product._id} variants={itemVariants}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
          
          <motion.div 
            className="view-all"
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/products" className="btn btn-secondary">
              View All Products <FaArrowRight />
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* About Section */}
      <motion.section 
        className="about-section section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="container about-container">
          <motion.div className="about-image" variants={itemVariants}>
            <img 
              src="https://images.unsplash.com/photo-1605117882932-f9e32b03fea9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2670&q=80" 
              alt="Artisan crafting" 
            />
          </motion.div>
          
          <motion.div className="about-content" variants={itemVariants}>
            <h2>Our Mission</h2>
            <p>
              At Cherish India, we believe in preserving and promoting India's rich cultural heritage 
              through authentic handcrafted products. We work directly with artisans across the country, 
              ensuring fair wages and sustainable practices.
            </p>
            <p>
              Every purchase you make helps support local communities and traditional craftsmanship, 
              creating a positive impact while bringing unique, high-quality products to your doorstep.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/products" className="btn btn-primary">
                Explore Our Products <FaArrowRight />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default HomePage;