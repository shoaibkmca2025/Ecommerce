import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaBox, FaCalendarAlt, FaRupeeSign, FaEye, FaChevronRight } from 'react-icons/fa';

const OrderCard = ({ order, compact = false }) => {
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending': return '#f59e0b';
      case 'processing': return '#3b82f6';
      case 'shipped': return '#8b5cf6';
      case 'delivered': return '#10b981';
      case 'cancelled': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getEstimatedDelivery = (orderDate) => {
    const deliveryDate = new Date(orderDate);
    deliveryDate.setDate(deliveryDate.getDate() + 7);
    return deliveryDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  if (compact) {
    return (
      <motion.div
        className="order-card compact"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="order-card-content">
          <div className="order-header">
            <div className="order-info">
              <span className="order-id">#{order._id.slice(-8).toUpperCase()}</span>
              <span className="order-date">{formatDate(order.createdAt)}</span>
            </div>
            <div className="order-status">
              <span
                className="status-badge"
                style={{ backgroundColor: getStatusColor(order.status) }}
              >
                {order.status}
              </span>
            </div>
          </div>

          <div className="order-summary">
            <div className="items-info">
              <FaBox className="items-icon" />
              <span>{order.orderItems.length} item{order.orderItems.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="order-total">
              <FaRupeeSign />
              <span>{order.totalPrice.toFixed(2)}</span>
            </div>
          </div>

          <Link to={`/order/${order._id}`} className="view-order-link">
            <FaEye /> View Details
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="order-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -2, boxShadow: '0 8px 25px rgba(0,0,0,0.1)' }}
    >
      <div className="order-card-content">
        <div className="order-header">
          <div className="order-info">
            <h3>Order #{order._id.slice(-8).toUpperCase()}</h3>
            <div className="order-meta">
              <span className="order-date">
                <FaCalendarAlt />
                {formatDate(order.createdAt)}
              </span>
              <span className="item-count">
                <FaBox />
                {order.orderItems.length} item{order.orderItems.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
          <div className="order-total">
            <FaRupeeSign />
            <span>{order.totalPrice.toFixed(2)}</span>
          </div>
        </div>

        <div className="order-status-section">
          <span
            className="status-badge"
            style={{ backgroundColor: getStatusColor(order.status) }}
          >
            {order.status}
          </span>
          {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
            <span className="estimated-delivery">
              Est. delivery: {getEstimatedDelivery(order.createdAt)}
            </span>
          )}
        </div>

        <div className="order-items-preview">
          {order.orderItems.slice(0, 2).map((item, index) => (
            <div key={index} className="item-preview">
              <img src={item.image} alt={item.name} />
              <div className="item-info">
                <h4>{item.name}</h4>
                <p>Qty: {item.qty} × ₹{item.price.toFixed(2)}</p>
              </div>
            </div>
          ))}
          {order.orderItems.length > 2 && (
            <div className="more-items">
              +{order.orderItems.length - 2} more
            </div>
          )}
        </div>

        <div className="order-actions">
          <Link to={`/order/${order._id}`} className="view-order-btn">
            <FaEye />
            View Details
          </Link>
          <FaChevronRight className="arrow-icon" />
        </div>
      </div>
    </motion.div>
  );
};

export default OrderCard;