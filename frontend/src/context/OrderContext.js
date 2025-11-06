import React, { createContext, useState, useEffect } from 'react';
import { orderAPI } from '../services/api';

export const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Create new order
  const createOrder = async (orderData) => {
    try {
      setLoading(true);
      setError(null);

      const { data } = await orderAPI.createOrder(orderData);
      setCurrentOrder(data);
      setOrders(prev => [data, ...prev]);
      setLoading(false);
      return data;
    } catch (error) {
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
      setLoading(false);
      throw error;
    }
  };

  // Get order by ID
  const getOrder = async (orderId) => {
    try {
      setLoading(true);
      setError(null);

      const { data } = await orderAPI.getOrder(orderId);
      setCurrentOrder(data);
      setLoading(false);
      return data;
    } catch (error) {
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
      setLoading(false);
      throw error;
    }
  };

  // Get user's orders
  const getMyOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data } = await orderAPI.getMyOrders();
      setOrders(data);
      setLoading(false);
      return data;
    } catch (error) {
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
      setLoading(false);
      throw error;
    }
  };

  // Get all orders (admin)
  const getAllOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data } = await orderAPI.getAllOrders();
      setOrders(data);
      setLoading(false);
      return data;
    } catch (error) {
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
      setLoading(false);
      throw error;
    }
  };

  // Update order status (admin)
  const updateOrderStatus = async (orderId, statusData) => {
    try {
      setLoading(true);
      setError(null);

      const { data } = await orderAPI.updateOrderStatus(orderId, statusData);

      // Update orders list
      setOrders(prev =>
        prev.map(order =>
          order._id === orderId ? data : order
        )
      );

      // Update current order if it matches
      if (currentOrder && currentOrder._id === orderId) {
        setCurrentOrder(data);
      }

      setLoading(false);
      return data;
    } catch (error) {
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
      setLoading(false);
      throw error;
    }
  };

  // Mark order as paid
  const markOrderAsPaid = async (orderId, paymentResult) => {
    try {
      setLoading(true);
      setError(null);

      const { data } = await orderAPI.updateOrderToPaid(orderId, paymentResult);

      // Update orders list
      setOrders(prev =>
        prev.map(order =>
          order._id === orderId ? data : order
        )
      );

      // Update current order if it matches
      if (currentOrder && currentOrder._id === orderId) {
        setCurrentOrder(data);
      }

      setLoading(false);
      return data;
    } catch (error) {
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
      setLoading(false);
      throw error;
    }
  };

  // Mark order as delivered (admin)
  const markOrderAsDelivered = async (orderId) => {
    try {
      setLoading(true);
      setError(null);

      const { data } = await orderAPI.updateOrderToDelivered(orderId);

      // Update orders list
      setOrders(prev =>
        prev.map(order =>
          order._id === orderId ? data : order
        )
      );

      // Update current order if it matches
      if (currentOrder && currentOrder._id === orderId) {
        setCurrentOrder(data);
      }

      setLoading(false);
      return data;
    } catch (error) {
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
      setLoading(false);
      throw error;
    }
  };

  // Cancel order
  const cancelOrder = async (orderId) => {
    try {
      setLoading(true);
      setError(null);

      const { data } = await orderAPI.cancelOrder(orderId);

      // Update orders list
      setOrders(prev =>
        prev.map(order =>
          order._id === orderId ? data : order
        )
      );

      // Update current order if it matches
      if (currentOrder && currentOrder._id === orderId) {
        setCurrentOrder(data);
      }

      setLoading(false);
      return data;
    } catch (error) {
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
      setLoading(false);
      throw error;
    }
  };

  // Clear current order
  const clearCurrentOrder = () => {
    setCurrentOrder(null);
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        currentOrder,
        loading,
        error,
        createOrder,
        getOrder,
        getMyOrders,
        getAllOrders,
        updateOrderStatus,
        markOrderAsPaid,
        markOrderAsDelivered,
        cancelOrder,
        clearCurrentOrder,
        clearError
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};