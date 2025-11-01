import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaEye } from 'react-icons/fa';
import { CartContext } from '../../context/CartContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);
  
  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product, 1);
  };

  return (
    <div className="product-card">
      <Link to={`/products/${product._id}`} className="product-link">
        <div className="product-image">
          <img 
            src={product.image.startsWith('/') ? `${process.env.PUBLIC_URL}${product.image}` : product.image} 
            alt={product.name} 
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `${process.env.PUBLIC_URL}/images/placeholder.svg`;
            }}
          />
          <div className="product-actions">
            <button className="action-btn view-btn">
              <FaEye />
            </button>
            <button 
              className="action-btn cart-btn"
              onClick={handleAddToCart}
            >
              <FaShoppingCart />
            </button>
          </div>
        </div>
        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>
          <p className="product-category">{product.category}</p>
          <p className="product-price">₹{product.price.toFixed(2)}</p>
          <button
            className={`add-to-cart${product.countInStock === 0 ? ' out-of-stock' : ''}`}
            onClick={handleAddToCart}
            disabled={product.countInStock === 0}
          >
            <FaShoppingCart /> {product.countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;