import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaBox, FaTruck, FaHome, FaShare, FaDownload } from 'react-icons/fa';
import { OrderContext } from '../context/OrderContext';
import { AuthContext } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import './OrderConfirmationPage.css';

const OrderConfirmationPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { currentOrder, getOrder, loading, error, clearCurrentOrder } = useContext(OrderContext);
  const { user } = useContext(AuthContext);

  const [shareMessage, setShareMessage] = useState('');

  useEffect(() => {
    // If we have a current order with the right ID, use it
    if (currentOrder && currentOrder._id === orderId) {
      return;
    }

    // Otherwise fetch the order
    if (orderId) {
      getOrder(orderId);
    }
  }, [orderId, currentOrder, getOrder]);

  // Calculate estimated delivery date (7 days from order date)
  const getEstimatedDelivery = () => {
    const orderDate = currentOrder?.createdAt || new Date();
    const deliveryDate = new Date(orderDate);
    deliveryDate.setDate(deliveryDate.getDate() + 7);
    return deliveryDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Share order functionality
  const shareOrder = () => {
    const orderDetails = `🎉 I just placed an order with Cherish India!\n\nOrder #${currentOrder?._id?.slice(-8).toUpperCase()}\nTotal: ₹${currentOrder?.totalPrice?.toFixed(2)}\nStatus: ${currentOrder?.status}\n\nThanks for your amazing products! 🛍️`;

    if (navigator.share) {
      navigator.share({
        title: 'Order Confirmation - Cherish India',
        text: orderDetails,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(orderDetails);
      setShareMessage('Order details copied to clipboard!');
      setTimeout(() => setShareMessage(''), 3000);
    }
  };

  // Download invoice functionality
  const downloadInvoice = () => {
    // This would normally generate a PDF invoice
    // For now, we'll show a simple message
    alert('Invoice download will be available soon. Your order has been confirmed!');
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <motion.div
        className="order-confirmation-page"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="container">
          <ErrorMessage message={error} />
          <div className="error-actions">
            <Link to="/orders" className="view-orders-btn">
              View My Orders
            </Link>
            <Link to="/" className="continue-shopping-btn">
              Continue Shopping
            </Link>
          </div>
        </div>
      </motion.div>
    );
  }

  if (!currentOrder) {
    return (
      <motion.div
        className="order-confirmation-page"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="container">
          <div className="order-not-found">
            <h2>Order Not Found</h2>
            <p>We couldn't find the order you're looking for.</p>
            <div className="not-found-actions">
              <Link to="/orders" className="view-orders-btn">
                View My Orders
              </Link>
              <Link to="/" className="continue-shopping-btn">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="order-confirmation-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="container">
        <motion.div
          className="success-header"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <FaCheckCircle className="success-icon" />
          <h1>Order Confirmed!</h1>
          <p>Thank you for your purchase. Your order has been successfully placed.</p>
        </motion.div>

        <div className="order-grid">
          {/* Order Details Card */}
          <motion.div
            className="order-details-card"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h2>Order Details</h2>
            <div className="order-info">
              <div className="info-row">
                <span>Order Number:</span>
                <span className="order-number">
                  #{currentOrder._id.slice(-8).toUpperCase()}
                </span>
              </div>
              <div className="info-row">
                <span>Order Date:</span>
                <span>{new Date(currentOrder.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="info-row">
                <span>Payment Method:</span>
                <span>{currentOrder.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</span>
              </div>
              <div className="info-row">
                <span>Status:</span>
                <span className={`status-badge ${currentOrder.status.toLowerCase()}`}>
                  {currentOrder.status}
                </span>
              </div>
              <div className="info-row">
                <span>Estimated Delivery:</span>
                <span className="delivery-date">{getEstimatedDelivery()}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="order-actions">
              <button onClick={shareOrder} className="share-btn">
                <FaShare /> Share Order
              </button>
              <button onClick={downloadInvoice} className="invoice-btn">
                <FaDownload /> Download Invoice
              </button>
            </div>

            {shareMessage && (
              <motion.div
                className="share-message"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {shareMessage}
              </motion.div>
            )}
          </motion.div>

          {/* Order Items Card */}
          <motion.div
            className="order-items-card"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h2>Order Items</h2>
            <div className="order-items">
              {currentOrder.orderItems.map((item, index) => (
                <div key={index} className="order-item">
                  <img src={item.image} alt={item.name} />
                  <div className="item-details">
                    <h4>{item.name}</h4>
                    <p>Quantity: {item.qty}</p>
                    <p className="item-price">₹{(item.price * item.qty).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="order-summary">
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>₹{currentOrder.taxPrice ?
                  (currentOrder.totalPrice - currentOrder.taxPrice - currentOrder.shippingPrice).toFixed(2) :
                  currentOrder.totalPrice.toFixed(2)
                }</span>
              </div>
              <div className="summary-row">
                <span>Shipping:</span>
                <span>₹{currentOrder.shippingPrice?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="summary-row">
                <span>Tax:</span>
                <span>₹{currentOrder.taxPrice?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="summary-row total">
                <span>Total:</span>
                <span>₹{currentOrder.totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </motion.div>

          {/* Shipping Address Card */}
          <motion.div
            className="shipping-card"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <h2>Shipping Address</h2>
            <div className="shipping-info">
              <p className="address-line">
                {currentOrder.shippingAddress.address}
              </p>
              <p className="address-line">
                {currentOrder.shippingAddress.city}, {currentOrder.shippingAddress.postalCode}
              </p>
              <p className="address-line">
                {currentOrder.shippingAddress.country}
              </p>
              <p className="address-line">
                Phone: {currentOrder.shippingAddress.phone}
              </p>
            </div>
          </motion.div>

          {/* Order Timeline */}
          <motion.div
            className="timeline-card"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <h2>Order Timeline</h2>
            <div className="order-timeline">
              <div className="timeline-item completed">
                <div className="timeline-icon">
                  <FaBox />
                </div>
                <div className="timeline-content">
                  <h4>Order Placed</h4>
                  <p>{new Date(currentOrder.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              {currentOrder.isPaid && (
                <div className="timeline-item completed">
                  <div className="timeline-icon">
                    <FaCheckCircle />
                  </div>
                  <div className="timeline-content">
                    <h4>Payment Confirmed</h4>
                    <p>{new Date(currentOrder.paidAt).toLocaleDateString()}</p>
                  </div>
                </div>
              )}

              {currentOrder.status === 'Processing' && (
                <div className="timeline-item completed">
                  <div className="timeline-icon">
                    <FaBox />
                  </div>
                  <div className="timeline-content">
                    <h4>Processing</h4>
                    <p>Your order is being prepared</p>
                  </div>
                </div>
              )}

              {currentOrder.status === 'Shipped' && (
                <div className="timeline-item completed">
                  <div className="timeline-icon">
                    <FaTruck />
                  </div>
                  <div className="timeline-content">
                    <h4>Shipped</h4>
                    <p>
                      {currentOrder.trackingNumber && (
                        <>Tracking: {currentOrder.trackingNumber}</>
                      )}
                      {currentOrder.carrier && (
                        <> via {currentOrder.carrier}</>
                      )}
                    </p>
                  </div>
                </div>
              )}

              {currentOrder.isDelivered && (
                <div className="timeline-item completed">
                  <div className="timeline-icon">
                    <FaHome />
                  </div>
                  <div className="timeline-content">
                    <h4>Delivered</h4>
                    <p>{new Date(currentOrder.deliveredAt).toLocaleDateString()}</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Navigation Actions */}
        <motion.div
          className="confirmation-actions"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <Link to={`/order/${currentOrder._id}`} className="track-order-btn">
            Track Order
          </Link>
          <Link to="/orders" className="view-orders-btn">
            View All Orders
          </Link>
          <Link to="/" className="continue-shopping-btn">
            Continue Shopping
          </Link>
        </motion.div>

        {/* Email Confirmation Notice */}
        <motion.div
          className="email-notice"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p>
            📧 A confirmation email has been sent to {user?.email || 'your registered email address'}.
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default OrderConfirmationPage;