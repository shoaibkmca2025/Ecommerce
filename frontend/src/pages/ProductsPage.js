import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import ProductCard from '../components/products/ProductCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { ProductsContext } from '../context/ProductsContext';
import './ProductsPage.css';

const ProductsPage = () => {
  const { products, loading } = useContext(ProductsContext);
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Get unique categories from products
  const categories = ['All', ...new Set(products.map(product => product.category))];

  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter(product => product.category === selectedCategory);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <motion.div 
      className="products-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="container">
        <motion.h1 
          className="page-title"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 100 }}
        >
          Our Products
        </motion.h1>

        <div className="products-container">
          <motion.div 
            className="filters"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h3>Categories</h3>
            <ul className="category-list">
              {categories.map((category, index) => (
                <motion.li 
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <button 
                    className={selectedCategory === category ? 'active' : ''}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </button>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div 
            className="products-grid"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {loading ? (
              <div className="loading-container">
                <LoadingSpinner size="large" />
                <p>Loading products...</p>
              </div>
            ) : filteredProducts.length > 0 ? (
              filteredProducts.map(product => (
                <ProductCard key={product._id} product={product} />
              ))
            ) : (
              <div className="no-products">
                <h3>No products found</h3>
                <p>Try selecting a different category or check back later.</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductsPage;