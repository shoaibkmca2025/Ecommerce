import React from 'react';
import { motion } from 'framer-motion';
import { FaRupeeSign } from 'react-icons/fa';

const OrderItemsList = ({ items, showImages = true, compact = false }) => {
  if (compact) {
    return (
      <div className="order-items-list compact">
        <div className="items-header">
          <span>Items ({items.length})</span>
          <span className="items-total">
            <FaRupeeSign />
            {items.reduce((total, item) => total + (item.price * item.qty), 0).toFixed(2)}
          </span>
        </div>
        <div className="items-list">
          {items.map((item, index) => (
            <div key={index} className="compact-item">
              <span className="item-name">{item.name}</span>
              <span className="item-details">
                {item.qty} × ₹{item.price.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="order-items-list">
      <h4>Order Items ({items.length})</h4>
      <div className="items-container">
        {items.map((item, index) => (
          <motion.div
            key={index}
            className="order-item"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            {showImages && (
              <div className="item-image">
                <img
                  src={item.image}
                  alt={item.name}
                  onError={(e) => {
                    e.target.src = '/placeholder-image.png'; // Fallback image
                  }}
                />
              </div>
            )}
            <div className="item-details">
              <h5>{item.name}</h5>
              <div className="item-meta">
                <span className="item-quantity">Quantity: {item.qty}</span>
                <span className="item-price">
                  <FaRupeeSign />
                  {item.price.toFixed(2)} each
                </span>
              </div>
              <div className="item-total">
                <FaRupeeSign />
                <span>{(item.price * item.qty).toFixed(2)}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="items-summary">
        <div className="summary-row">
          <span>Subtotal:</span>
          <span>
            <FaRupeeSign />
            {items.reduce((total, item) => total + (item.price * item.qty), 0).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrderItemsList;