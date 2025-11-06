import React from 'react';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaPhone, FaUser } from 'react-icons/fa';

const ShippingAddress = ({ address, title = 'Shipping Address', compact = false }) => {
  const formatAddress = () => {
    if (!address) return '';
    return `${address.address}, ${address.city}, ${address.postalCode}, ${address.country}`;
  };

  if (compact) {
    return (
      <div className="shipping-address compact">
        <h5>{title}</h5>
        <p className="address-text">
          <FaMapMarkerAlt />
          {formatAddress()}
        </p>
        <p className="address-phone">
          <FaPhone />
          {address?.phone}
        </p>
      </div>
    );
  }

  return (
    <motion.div
      className="shipping-address"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h4>
        <FaMapMarkerAlt />
        {title}
      </h4>
      <div className="address-details">
        <div className="address-line">
          <FaUser className="address-icon" />
          <span>{address?.name || 'Customer'}</span>
        </div>
        <div className="address-line">
          <span className="address-street">{address?.address}</span>
        </div>
        <div className="address-line">
          <span className="address-city">
            {address?.city}, {address?.postalCode}
          </span>
        </div>
        <div className="address-line">
          <span className="address-country">{address?.country}</span>
        </div>
        {address?.phone && (
          <div className="address-line">
            <FaPhone className="address-icon" />
            <span className="address-phone">{address.phone}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ShippingAddress;