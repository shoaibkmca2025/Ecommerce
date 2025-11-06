import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaBox,
  FaSearch,
  FaFilter,
  FaDownload,
  FaEye,
  FaEdit,
  FaTruck,
  FaCheckCircle,
  FaTimesCircle,
  FaCalendarAlt,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaChartBar,
  FaRupeeSign,
  FaChevronLeft,
  FaChevronRight,
  FaEllipsisV,
  FaExclamationTriangle
} from 'react-icons/fa';
import { OrderContext } from '../context/OrderContext';
import { AuthContext } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import './AdminOrdersPage.css';

const AdminOrdersPage = () => {
  const { orders, getAllOrders, updateOrderStatus, loading, error } = useContext(OrderContext);
  const { user } = useContext(AuthContext);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updateData, setUpdateData] = useState({
    status: '',
    trackingNumber: '',
    carrier: '',
    orderNotes: ''
  });

  const ordersPerPage = 10;

  useEffect(() => {
    if (user && user.isAdmin) {
      getAllOrders();
    }
  }, [user, getAllOrders]);

  // Check if user is admin
  if (!user || !user.isAdmin) {
    return (
      <motion.div
        className="admin-orders-page"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="container">
          <div className="access-denied">
            <FaExclamationTriangle className="warning-icon" />
            <h2>Access Denied</h2>
            <p>You don't have permission to access this page.</p>
            <Link to="/" className="home-btn">
              Go to Homepage
            </Link>
          </div>
        </div>
      </motion.div>
    );
  }

  // Filter and search orders
  const filteredOrders = orders.filter(order => {
    // Search filter
    const searchMatch = searchTerm === '' ||
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.orderItems.some(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

    // Status filter
    const statusMatch = statusFilter === 'all' || order.status === statusFilter;

    // Date filter
    let dateMatch = true;
    const orderDate = new Date(order.createdAt);
    const today = new Date();

    switch (dateFilter) {
      case 'today':
        dateMatch = orderDate.toDateString() === today.toDateString();
        break;
      case 'week':
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        dateMatch = orderDate >= weekAgo;
        break;
      case 'month':
        const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
        dateMatch = orderDate >= monthAgo;
        break;
      case 'year':
        const yearAgo = new Date(today.getTime() - 365 * 24 * 60 * 60 * 1000);
        dateMatch = orderDate >= yearAgo;
        break;
    }

    return searchMatch && statusMatch && dateMatch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  // Calculate statistics
  const calculateStats = () => {
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);
    const statusCounts = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {});

    return {
      totalOrders: orders.length,
      totalRevenue,
      statusCounts,
      todayOrders: orders.filter(order =>
        new Date(order.createdAt).toDateString() === new Date().toDateString()
      ).length,
      pendingOrders: statusCounts.Pending || 0,
      processingOrders: statusCounts.Processing || 0,
      shippedOrders: statusCounts.Shipped || 0,
      deliveredOrders: statusCounts.Delivered || 0,
      cancelledOrders: statusCounts.Cancelled || 0
    };
  };

  const stats = calculateStats();

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
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSelectOrder = (orderId) => {
    setSelectedOrders(prev =>
      prev.includes(orderId)
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleSelectAll = () => {
    if (selectedOrders.length === currentOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(currentOrders.map(order => order._id));
    }
  };

  const handleBulkStatusUpdate = async (newStatus) => {
    try {
      for (const orderId of selectedOrders) {
        await updateOrderStatus(orderId, { status: newStatus });
      }
      setSelectedOrders([]);
      setShowBulkActions(false);
    } catch (error) {
      console.error('Bulk update failed:', error);
    }
  };

  const handleUpdateOrder = (order) => {
    setSelectedOrder(order);
    setUpdateData({
      status: order.status,
      trackingNumber: order.trackingNumber || '',
      carrier: order.carrier || '',
      orderNotes: order.orderNotes || ''
    });
    setShowUpdateModal(true);
  };

  const handleSaveOrderUpdate = async () => {
    try {
      await updateOrderStatus(selectedOrder._id, updateData);
      setShowUpdateModal(false);
      setSelectedOrder(null);
    } catch (error) {
      console.error('Order update failed:', error);
    }
  };

  const exportToCSV = () => {
    const headers = [
      'Order ID', 'Customer', 'Email', 'Phone', 'Date', 'Status',
      'Items', 'Total', 'Payment Method', 'Address'
    ];

    const csvData = filteredOrders.map(order => [
      order._id.slice(-8).toUpperCase(),
      order.user?.name || 'N/A',
      order.user?.email || 'N/A',
      order.shippingAddress.phone,
      formatDate(order.createdAt),
      order.status,
      order.orderItems.length,
      order.totalPrice.toFixed(2),
      order.paymentMethod,
      `${order.shippingAddress.address}, ${order.shippingAddress.city}`
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading && orders.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <motion.div
      className="admin-orders-page"
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
            <h1>Order Management</h1>
            <p>Manage and track all customer orders</p>
          </div>
          <div className="header-actions">
            <button onClick={exportToCSV} className="export-btn">
              <FaDownload /> Export CSV
            </button>
          </div>
        </motion.div>

        {/* Statistics Dashboard */}
        <motion.div
          className="stats-dashboard"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">
                <FaBox />
              </div>
              <div className="stat-info">
                <h3>{stats.totalOrders}</h3>
                <p>Total Orders</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon revenue">
                <FaRupeeSign />
              </div>
              <div className="stat-info">
                <h3>₹{stats.totalRevenue.toFixed(0)}</h3>
                <p>Total Revenue</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon today">
                <FaCalendarAlt />
              </div>
              <div className="stat-info">
                <h3>{stats.todayOrders}</h3>
                <p>Today's Orders</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon pending">
                <FaExclamationTriangle />
              </div>
              <div className="stat-info">
                <h3>{stats.pendingOrders}</h3>
                <p>Pending Orders</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          className="filters-section"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="search-bar">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search by order ID, customer, email, or product..."
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
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="filter-group">
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Bulk Actions */}
        {selectedOrders.length > 0 && (
          <motion.div
            className="bulk-actions"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <p>{selectedOrders.length} order{selectedOrders.length !== 1 ? 's' : ''} selected</p>
            <div className="bulk-buttons">
              <button onClick={() => handleBulkStatusUpdate('Processing')}>
                Mark as Processing
              </button>
              <button onClick={() => handleBulkStatusUpdate('Shipped')}>
                Mark as Shipped
              </button>
              <button onClick={() => handleBulkStatusUpdate('Delivered')}>
                Mark as Delivered
              </button>
              <button onClick={() => handleBulkStatusUpdate('Cancelled')}>
                Cancel Orders
              </button>
            </div>
          </motion.div>
        )}

        {/* Error Message */}
        {error && <ErrorMessage message={error} />}

        {/* Orders Table */}
        <motion.div
          className="orders-table-container"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {currentOrders.length === 0 ? (
            <div className="empty-orders">
              <FaBox className="empty-icon" />
              <h2>No Orders Found</h2>
              <p>
                {searchTerm || statusFilter !== 'all' || dateFilter !== 'all'
                  ? 'Try adjusting your filters or search terms'
                  : 'No orders have been placed yet'}
              </p>
            </div>
          ) : (
            <div className="orders-table">
              <div className="table-header">
                <div className="table-row">
                  <div className="table-cell checkbox">
                    <input
                      type="checkbox"
                      checked={selectedOrders.length === currentOrders.length}
                      onChange={handleSelectAll}
                    />
                  </div>
                  <div className="table-cell">Order ID</div>
                  <div className="table-cell">Customer</div>
                  <div className="table-cell">Date</div>
                  <div className="table-cell">Items</div>
                  <div className="table-cell">Total</div>
                  <div className="table-cell">Status</div>
                  <div className="table-cell">Actions</div>
                </div>
              </div>

              <div className="table-body">
                {currentOrders.map((order, index) => (
                  <motion.div
                    key={order._id}
                    className="table-row"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 + index * 0.02 }}
                  >
                    <div className="table-cell checkbox">
                      <input
                        type="checkbox"
                        checked={selectedOrders.includes(order._id)}
                        onChange={() => handleSelectOrder(order._id)}
                      />
                    </div>
                    <div className="table-cell">
                      <span className="order-id">
                        #{order._id.slice(-8).toUpperCase()}
                      </span>
                    </div>
                    <div className="table-cell">
                      <div className="customer-info">
                        <div className="customer-name">{order.user?.name || 'N/A'}</div>
                        <div className="customer-email">{order.user?.email || 'N/A'}</div>
                      </div>
                    </div>
                    <div className="table-cell">
                      <span className="order-date">
                        {formatDate(order.createdAt)}
                      </span>
                    </div>
                    <div className="table-cell">
                      <span className="items-count">
                        {order.orderItems.length} items
                      </span>
                    </div>
                    <div className="table-cell">
                      <span className="order-total">
                        ₹{order.totalPrice.toFixed(2)}
                      </span>
                    </div>
                    <div className="table-cell">
                      <span
                        className="status-badge"
                        style={{ backgroundColor: getStatusColor(order.status) }}
                      >
                        {order.status}
                      </span>
                    </div>
                    <div className="table-cell actions">
                      <div className="action-buttons">
                        <Link
                          to={`/order/${order._id}`}
                          className="action-btn view"
                          title="View Order"
                        >
                          <FaEye />
                        </Link>
                        <button
                          onClick={() => handleUpdateOrder(order)}
                          className="action-btn edit"
                          title="Update Order"
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="action-btn menu"
                          title="More Options"
                        >
                          <FaEllipsisV />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="pagination-btn"
              >
                <FaChevronLeft />
              </button>
              <span className="page-info">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="pagination-btn"
              >
                <FaChevronRight />
              </button>
            </div>
          )}
        </motion.div>
      </div>

      {/* Update Order Modal */}
      {showUpdateModal && selectedOrder && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setShowUpdateModal(false)}
        >
          <motion.div
            className="update-modal"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>Update Order #{selectedOrder._id.slice(-8).toUpperCase()}</h2>
              <button
                onClick={() => setShowUpdateModal(false)}
                className="close-modal"
              >
                <FaTimes />
              </button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label>Order Status</label>
                <select
                  value={updateData.status}
                  onChange={(e) => setUpdateData(prev => ({ ...prev, status: e.target.value }))}
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              {(updateData.status === 'Shipped' || updateData.status === 'Delivered') && (
                <>
                  <div className="form-group">
                    <label>Carrier</label>
                    <input
                      type="text"
                      value={updateData.carrier}
                      onChange={(e) => setUpdateData(prev => ({ ...prev, carrier: e.target.value }))}
                      placeholder="e.g., FedEx, UPS, DHL"
                    />
                  </div>

                  <div className="form-group">
                    <label>Tracking Number</label>
                    <input
                      type="text"
                      value={updateData.trackingNumber}
                      onChange={(e) => setUpdateData(prev => ({ ...prev, trackingNumber: e.target.value }))}
                      placeholder="Enter tracking number"
                    />
                  </div>
                </>
              )}

              <div className="form-group">
                <label>Order Notes</label>
                <textarea
                  value={updateData.orderNotes}
                  onChange={(e) => setUpdateData(prev => ({ ...prev, orderNotes: e.target.value }))}
                  placeholder="Add any notes about this order..."
                  rows="4"
                />
              </div>
            </div>

            <div className="modal-actions">
              <button
                onClick={() => setShowUpdateModal(false)}
                className="cancel-btn"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveOrderUpdate}
                className="save-btn"
              >
                Update Order
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default AdminOrdersPage;