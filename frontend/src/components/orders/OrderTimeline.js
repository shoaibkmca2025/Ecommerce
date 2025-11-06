import React from 'react';
import { motion } from 'framer-motion';
import { FaBox, FaCheckCircle, FaTruck, FaHome, FaClock, FaTimesCircle } from 'react-icons/fa';

const OrderTimeline = ({ order, compact = false }) => {
  const getTimelineEvents = () => {
    const events = [];

    // Order placed
    events.push({
      id: 'placed',
      icon: FaBox,
      title: 'Order Placed',
      date: order.createdAt,
      status: 'completed',
      description: 'Your order has been received and is being processed.'
    });

    // Payment confirmed
    if (order.isPaid) {
      events.push({
        id: 'paid',
        icon: FaCheckCircle,
        title: 'Payment Confirmed',
        date: order.paidAt,
        status: 'completed',
        description: 'Payment has been successfully processed.'
      });
    }

    // Processing
    if (['Processing', 'Shipped', 'Delivered'].includes(order.status)) {
      events.push({
        id: 'processing',
        icon: FaClock,
        title: 'Processing',
        date: null,
        status: 'completed',
        description: 'Your order is being prepared for shipment.'
      });
    }

    // Shipped
    if (order.status === 'Shipped' || order.status === 'Delivered') {
      events.push({
        id: 'shipped',
        icon: FaTruck,
        title: 'Shipped',
        date: null,
        status: 'completed',
        description: `Your order has been shipped${order.carrier ? ` via ${order.carrier}` : ''}.${order.trackingNumber ? ` Tracking: ${order.trackingNumber}` : ''}`
      });
    }

    // Delivered
    if (order.isDelivered) {
      events.push({
        id: 'delivered',
        icon: FaHome,
        title: 'Delivered',
        date: order.deliveredAt,
        status: 'completed',
        description: 'Your order has been successfully delivered.'
      });
    }

    // Cancelled
    if (order.status === 'Cancelled') {
      events.push({
        id: 'cancelled',
        icon: FaTimesCircle,
        title: 'Cancelled',
        date: null,
        status: 'cancelled',
        description: 'Order has been cancelled.'
      });
    }

    return events;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'In Progress';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const timelineEvents = getTimelineEvents();

  if (compact) {
    return (
      <div className="order-timeline compact">
        <div className="timeline-track">
          {timelineEvents.map((event, index) => (
            <div key={event.id} className="timeline-point">
              <div
                className={`timeline-dot ${event.status}`}
                title={event.title}
              />
              {index < timelineEvents.length - 1 && (
                <div
                  className={`timeline-line ${index < timelineEvents.length - 2 ? 'completed' : event.status}`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="timeline-labels">
          {timelineEvents.map((event) => (
            <div key={event.id} className="timeline-label">
              <span className="label-title">{event.title}</span>
              <span className="label-date">{formatDate(event.date)}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="order-timeline">
      <h3>Order Timeline</h3>
      <div className="timeline-events">
        {timelineEvents.map((event, index) => {
          const Icon = event.icon;
          return (
            <motion.div
              key={event.id}
              className={`timeline-event ${event.status}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="timeline-icon">
                <Icon />
              </div>
              <div className="timeline-content">
                <h4>{event.title}</h4>
                <p className="timeline-date">{formatDate(event.date)}</p>
                <p className="timeline-description">{event.description}</p>
              </div>
              {index < timelineEvents.length - 1 && (
                <div className="timeline-connector" />
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderTimeline;