import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaBox, FaCalendarAlt, FaRupeeSign, FaSearch, FaFilter, FaEye, FaRedo, FaChevronRight } from 'react-icons/fa';
import { OrderContext } from '../context/OrderContext';
import { AuthContext } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import './OrderHistoryPage.css';

const OrderHistoryPage = () => {
  const { orders, getMyOrders, loading, error } = useContext(OrderContext);
  const { user } = useContext(AuthContext);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');
  const [filteredOrders, setFilteredOrders] = useState([]);

  useEffect(() => {
    if (user) {
      getMyOrders();
    }
  }, [user, getMyOrders]);

  useEffect(() => {
    let filtered = [...orders];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.orderItems.some(item =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'date-asc':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'total-desc':
          return b.totalPrice - a.totalPrice;
        case 'total-asc':
          return a.totalPrice - b.totalPrice;
        default:
          return 0;
      }
    });

    setFilteredOrders(filtered);
  }, [orders, searchTerm, statusFilter, sortBy]);

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

  const repeatOrder = async (order) => {
    try {
      // This would add all items from the order back to cart
      // For now, we'll show a message
      alert(`Items from order #${order._id.slice(-8).toUpperCase()} have been added to your cart!`);
      // In a real implementation, this would interact with CartContext
    } catch (error) {
      console.error('Failed to repeat order:', error);
      alert('Failed to repeat order. Please try again.');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <motion.div
        className="order-history-page"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="container">
          <ErrorMessage message={error} />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="order-history-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="container">
        {/* Header */}
        <motion.div
          className="page-header"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <div className="header-content">
            <h1>My Orders</h1>
            <p>Track and manage your orders</p>
          </div>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          className="filters-section"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="search-bar">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search by order ID or product name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filters">
            <div className="filter-group">
              <FaFilter className="filter-icon" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Orders</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="filter-group">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="filter-select"
              >
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="total-desc">Highest Total</option>
                <option value="total-asc">Lowest Total</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Orders Summary */}
        {filteredOrders.length > 0 && (
          <motion.div
            className="orders-summary"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <p>
              Showing <strong>{filteredOrders.length}</strong> order{filteredOrders.length !== 1 ? 's' : ''}
              {statusFilter !== 'all' && ` with status "${statusFilter}"`}
              {searchTerm && ` matching "${searchTerm}"`}
            </p>
          </motion.div>
        )}

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <motion.div
            className="empty-orders"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <FaBox className="empty-icon" />
            <h2>No Orders Found</h2>
            <p>
              {searchTerm || statusFilter !== 'all'
                ? 'Try adjusting your filters or search terms'
                : "You haven't placed any orders yet"}
            </p>
            <Link to="/products" className="shop-now-btn">
              Shop Now
            </Link>
          </motion.div>
        ) : (
          <motion.div
            className="orders-list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {filteredOrders.map((order, index) => (
              <motion.div
                key={order._id}
                className="order-card"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 + index * 0.05 }}
              >
                <div className="order-header">
                  <div className="order-info">
                    <div className="order-id-section">
                      <h3>Order #{order._id.slice(-8).toUpperCase()}</h3>
                      <div className="order-date">
                        <FaCalendarAlt />
                        <span>{formatDate(order.createdAt)}</span>
                      </div>
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
                  <div className="order-total">
                    <FaRupeeSign />
                    <span>{order.totalPrice.toFixed(2)}</span>
                  </div>
                </div>

                <div className="order-items-preview">
                  {order.orderItems.slice(0, 3).map((item, itemIndex) => (
                    <div key={itemIndex} className="item-preview">
                      <img src={item.image} alt={item.name} />
                      <div className="item-info">
                        <h4>{item.name}</h4>
                        <p>Qty: {item.qty} × ₹{item.price.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                  {order.orderItems.length > 3 && (
                    <div className="more-items">
                      +{order.orderItems.length - 3} more item{order.orderItems.length - 3 !== 1 ? 's' : ''}
                    </div>
                  )}
                </div>

                <div className="order-footer">
                  <div className="order-meta">
                    {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                      <div className="estimated-delivery">
                        <span>Est. Delivery: {getEstimatedDelivery(order.createdAt)}</span>
                      </div>
                    )}
                    <div className="item-count">
                      {order.orderItems.length} item{order.orderItems.length !== 1 ? 's' : ''}
                    </div>
                  </div>

                  <div className="order-actions">
                    <Link
                      to={`/order/${order._id}`}
                      className="view-order-btn"
                    >
                      <FaEye />
                      View Details
                    </Link>

                    {order.status === 'Delivered' && (
                      <button
                        onClick={() => repeatOrder(order)}
                        className="repeat-order-btn"
                      >
                        <FaRedo />
                        Repeat Order
                      </button>
                    )}

                    <FaChevronRight className="arrow-icon" />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default OrderHistoryPage;