import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaBox,
  FaTruck,
  FaHome,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaCreditCard,
  FaRupeeSign,
  FaArrowLeft,
  FaDownload,
  FaTimes,
  FaExclamationTriangle
} from 'react-icons/fa';
import { OrderContext } from '../context/OrderContext';
import { AuthContext } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import './OrderDetailPage.css';

const OrderDetailPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { currentOrder, getOrder, cancelOrder, loading, error } = useContext(OrderContext);
  const { user } = useContext(AuthContext);

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancellationReason, setCancellationReason] = useState('');

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

  const handleCancelOrder = async () => {
    if (!cancellationReason.trim()) {
      alert('Please provide a reason for cancellation.');
      return;
    }

    try {
      await cancelOrder(orderId);
      setShowCancelModal(false);
      setCancellationReason('');
      // Show success message or navigate to orders
    } catch (error) {
      console.error('Failed to cancel order:', error);
    }
  };

  const downloadInvoice = () => {
    // This would normally generate a PDF invoice
    alert('Invoice download will be available soon!');
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return '#f59e0b';
      case 'processing':
        return '#3b82f6';
      case 'shipped':
        return '#8b5cf6';
      case 'delivered':
        return '#10b981';
      case 'cancelled':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAddress = (address) => {
    return `${address.address}, ${address.city}, ${address.postalCode}, ${address.country}`;
  };

  const getTimelineEvents = () => {
    const events = [];

    // Order placed
    events.push({
      icon: FaBox,
      title: 'Order Placed',
      date: formatDate(currentOrder.createdAt),
      status: 'completed',
      description: 'Your order has been received and is being processed.'
    });

    // Payment confirmed
    if (currentOrder.isPaid) {
      events.push({
        icon: FaCheckCircle,
        title: 'Payment Confirmed',
        date: formatDate(currentOrder.paidAt),
        status: 'completed',
        description: 'Payment has been successfully processed.'
      });
    }

    // Processing
    if (['Processing', 'Shipped', 'Delivered'].includes(currentOrder.status)) {
      events.push({
        icon: FaClock,
        title: 'Processing',
        date: 'In Progress',
        status: 'completed',
        description: 'Your order is being prepared for shipment.'
      });
    }

    // Shipped
    if (currentOrder.status === 'Shipped' || currentOrder.status === 'Delivered') {
      events.push({
        icon: FaTruck,
        title: 'Shipped',
        date: 'Shipped',
        status: 'completed',
        description: `Your order has been shipped${currentOrder.carrier ? ` via ${currentOrder.carrier}` : ''}.${currentOrder.trackingNumber ? ` Tracking number: ${currentOrder.trackingNumber}` : ''}`
      });
    }

    // Delivered
    if (currentOrder.isDelivered) {
      events.push({
        icon: FaHome,
        title: 'Delivered',
        date: formatDate(currentOrder.deliveredAt),
        status: 'completed',
        description: 'Your order has been successfully delivered.'
      });
    }

    // Cancelled
    if (currentOrder.status === 'Cancelled') {
      events.push({
        icon: FaTimesCircle,
        title: 'Cancelled',
        date: 'Cancelled',
        status: 'cancelled',
        description: 'Order has been cancelled.'
      });
    }

    return events;
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <motion.div
        className="order-detail-page"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="container">
          <ErrorMessage message={error} />
          <div className="error-actions">
            <Link to="/orders" className="back-btn">
              <FaArrowLeft /> Back to Orders
            </Link>
          </div>
        </div>
      </motion.div>
    );
  }

  if (!currentOrder) {
    return (
      <motion.div
        className="order-detail-page"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="container">
          <div className="order-not-found">
            <h2>Order Not Found</h2>
            <p>We couldn't find the order you're looking for.</p>
            <Link to="/orders" className="back-btn">
              <FaArrowLeft /> Back to Orders
            </Link>
          </div>
        </div>
      </motion.div>
    );
  }

  const canCancelOrder = currentOrder.status === 'Pending' && !currentOrder.isPaid;

  return (
    <motion.div
      className="order-detail-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="container">
        {/* Header */}
        <motion.div
          className="order-header"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <Link to="/orders" className="back-nav">
            <FaArrowLeft /> Back to Orders
          </Link>
          <div className="order-title">
            <h1>Order Details</h1>
            <div className="order-meta">
              <span className="order-id">#{currentOrder._id.slice(-8).toUpperCase()}</span>
              <span
                className="status-badge"
                style={{ backgroundColor: getStatusColor(currentOrder.status) }}
              >
                {currentOrder.status}
              </span>
            </div>
          </div>
          <div className="order-actions-header">
            <button onClick={downloadInvoice} className="download-invoice-btn">
              <FaDownload /> Download Invoice
            </button>
            {canCancelOrder && (
              <button
                onClick={() => setShowCancelModal(true)}
                className="cancel-order-btn"
              >
                <FaTimes /> Cancel Order
              </button>
            )}
          </div>
        </motion.div>

        <div className="order-grid">
          {/* Order Items */}
          <motion.div
            className="order-items-section"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <h2>Order Items</h2>
            <div className="items-list">
              {currentOrder.orderItems.map((item, index) => (
                <div key={index} className="order-item">
                  <img src={item.image} alt={item.name} />
                  <div className="item-details">
                    <h3>{item.name}</h3>
                    <p className="item-quantity">Quantity: {item.qty}</p>
                    <p className="item-price">
                      <FaRupeeSign />
                      {(item.price * item.qty).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="order-summary">
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>
                  <FaRupeeSign />
                  {currentOrder.totalPrice - (currentOrder.taxPrice || 0) - (currentOrder.shippingPrice || 0)}
                </span>
              </div>
              <div className="summary-row">
                <span>Shipping:</span>
                <span>
                  <FaRupeeSign />
                  {(currentOrder.shippingPrice || 0).toFixed(2)}
                </span>
              </div>
              <div className="summary-row">
                <span>Tax:</span>
                <span>
                  <FaRupeeSign />
                  {(currentOrder.taxPrice || 0).toFixed(2)}
                </span>
              </div>
              <div className="summary-row total">
                <span>Total:</span>
                <span>
                  <FaRupeeSign />
                  {currentOrder.totalPrice.toFixed(2)}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Order Information */}
          <motion.div
            className="order-info-section"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {/* Shipping Address */}
            <div className="info-card">
              <h2>
                <FaMapMarkerAlt /> Shipping Address
              </h2>
              <div className="address-info">
                <p>{currentOrder.shippingAddress.address}</p>
                <p>{currentOrder.shippingAddress.city}, {currentOrder.shippingAddress.postalCode}</p>
                <p>{currentOrder.shippingAddress.country}</p>
                <p>
                  <FaPhone /> {currentOrder.shippingAddress.phone}
                </p>
              </div>
            </div>

            {/* Payment Information */}
            <div className="info-card">
              <h2>
                <FaCreditCard /> Payment Information
              </h2>
              <div className="payment-info">
                <div className="payment-row">
                  <span>Method:</span>
                  <span>
                    {currentOrder.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                  </span>
                </div>
                <div className="payment-row">
                  <span>Status:</span>
                  <span className={currentOrder.isPaid ? 'paid' : 'pending'}>
                    {currentOrder.isPaid ? 'Paid' : 'Pending'}
                  </span>
                </div>
                {currentOrder.isPaid && (
                  <div className="payment-row">
                    <span>Paid On:</span>
                    <span>{formatDate(currentOrder.paidAt)}</span>
                  </div>
                )}
                <div className="payment-row">
                  <span>Total Amount:</span>
                  <span className="total-amount">
                    <FaRupeeSign />
                    {currentOrder.totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Tracking Information */}
            {(currentOrder.status === 'Shipped' || currentOrder.status === 'Delivered') && (
              <div className="info-card">
                <h2>
                  <FaTruck /> Tracking Information
                </h2>
                <div className="tracking-info">
                  {currentOrder.carrier && (
                    <div className="tracking-row">
                      <span>Carrier:</span>
                      <span>{currentOrder.carrier}</span>
                    </div>
                  )}
                  {currentOrder.trackingNumber && (
                    <div className="tracking-row">
                      <span>Tracking Number:</span>
                      <span className="tracking-number">{currentOrder.trackingNumber}</span>
                    </div>
                  )}
                  {currentOrder.isDelivered && (
                    <div className="tracking-row">
                      <span>Delivered On:</span>
                      <span>{formatDate(currentOrder.deliveredAt)}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Order Timeline */}
        <motion.div
          className="timeline-section"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2>Order Timeline</h2>
          <div className="timeline">
            {getTimelineEvents().map((event, index) => (
              <div key={index} className={`timeline-item ${event.status}`}>
                <div className="timeline-icon">
                  <event.icon />
                </div>
                <div className="timeline-content">
                  <h3>{event.title}</h3>
                  <p className="timeline-date">{event.date}</p>
                  <p className="timeline-description">{event.description}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Order Notes */}
        {currentOrder.orderNotes && (
          <motion.div
            className="notes-section"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h2>Order Notes</h2>
            <p>{currentOrder.orderNotes}</p>
          </motion.div>
        )}
      </div>

      {/* Cancellation Modal */}
      {showCancelModal && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setShowCancelModal(false)}
        >
          <motion.div
            className="cancel-modal"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <FaExclamationTriangle className="warning-icon" />
              <h2>Cancel Order</h2>
              <button
                onClick={() => setShowCancelModal(false)}
                className="close-modal"
              >
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to cancel this order?</p>
              <p className="warning-text">
                This action cannot be undone and your items will be restocked.
              </p>
              <textarea
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                placeholder="Please provide a reason for cancellation..."
                className="cancellation-reason"
                rows="4"
              />
            </div>
            <div className="modal-actions">
              <button
                onClick={() => setShowCancelModal(false)}
                className="cancel-btn"
                disabled={loading}
              >
                Keep Order
              </button>
              <button
                onClick={handleCancelOrder}
                className="confirm-cancel-btn"
                disabled={loading || !cancellationReason.trim()}
              >
                {loading ? 'Cancelling...' : 'Cancel Order'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default OrderDetailPage;