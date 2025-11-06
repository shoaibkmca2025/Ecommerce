import React from 'react';
import { motion } from 'framer-motion';
import { FaClock, FaCheckCircle, FaBox, FaTruck, FaHome, FaTimesCircle } from 'react-icons/fa';

const OrderStatusBadge = ({ status, size = 'medium', showIcon = true }) => {
  const getStatusInfo = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return {
          color: '#f59e0b',
          bgColor: '#fef3c7',
          icon: FaClock,
          label: 'Pending'
        };
      case 'processing':
        return {
          color: '#3b82f6',
          bgColor: '#dbeafe',
          icon: FaBox,
          label: 'Processing'
        };
      case 'shipped':
        return {
          color: '#8b5cf6',
          bgColor: '#e9d5ff',
          icon: FaTruck,
          label: 'Shipped'
        };
      case 'delivered':
        return {
          color: '#10b981',
          bgColor: '#d1fae5',
          icon: FaHome,
          label: 'Delivered'
        };
      case 'cancelled':
        return {
          color: '#ef4444',
          bgColor: '#fee2e2',
          icon: FaTimesCircle,
          label: 'Cancelled'
        };
      default:
        return {
          color: '#6b7280',
          bgColor: '#f3f4f6',
          icon: FaBox,
          label: status
        };
    }
  };

  const statusInfo = getStatusInfo(status);
  const Icon = statusInfo.icon;

  const sizeClasses = {
    small: 'badge-small',
    medium: 'badge-medium',
    large: 'badge-large'
  };

  return (
    <motion.div
      className={`order-status-badge ${sizeClasses[size]}`}
      style={{
        backgroundColor: statusInfo.bgColor,
        color: statusInfo.color,
        border: `1px solid ${statusInfo.color}20`
      }}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      {showIcon && (
        <Icon className="status-icon" />
      )}
      <span className="status-text">{statusInfo.label}</span>
    </motion.div>
  );
};

export default OrderStatusBadge;