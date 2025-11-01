import React, { useState, useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaShoppingCart, FaMinus, FaPlus } from 'react-icons/fa';
import { CartContext } from '../context/CartContext';
import { ProductsContext } from '../context/ProductsContext';
import './ProductDetailPage.css';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const { products, loading, fetchProduct } = useContext(ProductsContext);
  const [quantity, setQuantity] = useState(1);
  const [currentProduct, setCurrentProduct] = useState(null);
  
  // Use effect to fetch the product when ID changes
  useEffect(() => {
    const loadProduct = async () => {
      try {
        // First try to find in existing products
        const existingProduct = products.find(p => p._id === id);
        if (existingProduct) {
          setCurrentProduct(existingProduct);
          setQuantity(1);
        } else {
          // If not found, fetch from API
          const product = await fetchProduct(id);
          setCurrentProduct(product);
          setQuantity(1);
        }
      } catch (error) {
        console.error('Error loading product:', error);
        navigate('/products');
      }
    };

    if (id) {
      loadProduct();
    }
  }, [id, navigate, products, fetchProduct]);
  
  // If product is not loaded yet, show loading
  if (!currentProduct) {
    return <div className="loading">Loading product...</div>;
  }

  const handleAddToCart = () => {
    addToCart(currentProduct, quantity);
  };

  const incrementQuantity = () => {
    if (quantity < currentProduct.countInStock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <motion.div 
      className="product-detail-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="container">
        <div className="product-detail-container">
          <motion.div 
            className="product-image"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <img 
              src={currentProduct.image} 
              alt={currentProduct.name} 
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/images/placeholder.svg';
              }}
            />
          </motion.div>
          
          <motion.div 
            className="product-info"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h1>{currentProduct.name}</h1>
            <p className="product-category">{currentProduct.category}</p>
            <p className="product-price">₹{currentProduct.price.toFixed(2)}</p>
            <div className="product-description">
              <h3>Description</h3>
              <p>{currentProduct.description}</p>
            </div>
            
            <div className="product-actions">
              <div className="quantity-selector">
                <button 
                  onClick={decrementQuantity}
                  disabled={quantity === 1}
                >
                  <FaMinus />
                </button>
                <span>{quantity}</span>
                <button 
                  onClick={incrementQuantity}
                  disabled={quantity === currentProduct.countInStock}
                >
                  <FaPlus />
                </button>
              </div>
              
              <motion.button 
                className="add-to-cart-btn"
                onClick={handleAddToCart}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaShoppingCart /> Add to Cart
              </motion.button>
            </div>
            
            <p className="stock-status">
              Status: <span className={currentProduct.countInStock > 0 ? 'in-stock' : 'out-of-stock'}>
                {currentProduct.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
              </span>
            </p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductDetailPage;