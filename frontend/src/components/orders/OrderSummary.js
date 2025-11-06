import React from 'react';
import { motion } from 'framer-motion';
import { FaRupeeSign, FaTruck, FaReceipt } from 'react-icons/fa';

const OrderSummary = ({ order, showPayment = true, compact = false }) => {
  const subtotal = order.taxPrice && order.shippingPrice
    ? order.totalPrice - order.taxPrice - order.shippingPrice
    : order.totalPrice;

  if (compact) {
    return (
      <div className="order-summary compact">
        <div className="summary-row total">
          <span>Total:</span>
          <span className="total-amount">
            <FaRupeeSign />
            {order.totalPrice.toFixed(2)}
          </span>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="order-summary"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h4>
        <FaReceipt />
        Order Summary
      </h4>
      <div className="summary-details">
        <div className="summary-row">
          <span>Subtotal:</span>
          <span>
            <FaRupeeSign />
            {subtotal.toFixed(2)}
          </span>
        </div>

        {(order.shippingPrice !== undefined && order.shippingPrice > 0) && (
          <div className="summary-row">
            <span>
              <FaTruck />
              Shipping:
            </span>
            <span>
              <FaRupeeSign />
              {order.shippingPrice.toFixed(2)}
            </span>
          </div>
        )}

        {order.taxPrice !== undefined && order.taxPrice > 0 && (
          <div className="summary-row">
            <span>Tax:</span>
            <span>
              <FaRupeeSign />
              {order.taxPrice.toFixed(2)}
            </span>
          </div>
        )}

        {showPayment && (
          <div className="summary-row">
            <span>Payment Method:</span>
            <span className="payment-method">
              {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
            </span>
          </div>
        )}

        {showPayment && (
          <div className="summary-row">
            <span>Payment Status:</span>
            <span className={`payment-status ${order.isPaid ? 'paid' : 'pending'}`}>
              {order.isPaid ? 'Paid' : 'Pending'}
            </span>
          </div>
        )}

        <div className="summary-row total">
          <span>Total Amount:</span>
          <span className="total-amount">
            <FaRupeeSign />
            {order.totalPrice.toFixed(2)}
          </span>
        </div>
      </div>

      {order.isPaid && order.paidAt && (
        <div className="payment-info">
          <small>Paid on {new Date(order.paidAt).toLocaleDateString()}</small>
        </div>
      )}
    </motion.div>
  );
};

export default OrderSummary;