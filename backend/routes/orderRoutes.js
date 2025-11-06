const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/auth');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      taxPrice,
      shippingPrice,
      totalPrice
    } = req.body;

    // Validate order items
    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    // Check if products exist and have sufficient stock
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.name}` });
      }
      if (product.countInStock < item.qty) {
        return res.status(400).json({
          message: `Insufficient stock for ${item.name}. Only ${product.countInStock} available.`
        });
      }
    }

    // Create order
    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      taxPrice,
      shippingPrice,
      totalPrice
    });

    // Update product stock
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { countInStock: -item.qty }
      });
    }

    // Save order
    const createdOrder = await order.save();

    // Add order to user's orders array
    await User.findByIdAndUpdate(req.user._id, {
      $push: { orders: createdOrder._id }
    });

    res.status(201).json(createdOrder);
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Server error while creating order', error: error.message });
  }
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('orderItems.product', 'name image price');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user owns the order or is admin
    if (order.user._id.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    res.json(order);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ message: 'Server error while fetching order', error: error.message });
  }
});

// @desc    Get logged in user's orders
// @route   GET /api/orders/myorders
// @access  Private
router.get('/myorders', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('orderItems.product', 'name image')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error('Get my orders error:', error);
    res.status(500).json({ message: 'Server error while fetching orders', error: error.message });
  }
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Admin
router.get('/', protect, admin, async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'name email')
      .populate('orderItems.product', 'name')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({ message: 'Server error while fetching orders', error: error.message });
  }
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Admin
router.put('/:id/status', protect, admin, async (req, res) => {
  try {
    const { status, trackingNumber, carrier, orderNotes } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Update status and relevant timestamps
    order.status = status;

    if (status === 'Processing') {
      order.isPaid = true;
      order.paidAt = new Date();
    }

    if (status === 'Shipped') {
      order.trackingNumber = trackingNumber;
      order.carrier = carrier;
    }

    if (status === 'Delivered') {
      order.isDelivered = true;
      order.deliveredAt = new Date();
    }

    if (orderNotes) {
      order.orderNotes = orderNotes;
    }

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Server error while updating order status', error: error.message });
  }
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
router.put('/:id/pay', protect, async (req, res) => {
  try {
    const { paymentResult } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user owns the order
    if (order.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized to update this order' });
    }

    order.isPaid = true;
    order.paidAt = new Date();
    order.paymentResult = paymentResult;
    order.status = 'Processing';

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    console.error('Update order to paid error:', error);
    res.status(500).json({ message: 'Server error while updating order payment', error: error.message });
  }
});

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Admin
router.put('/:id/deliver', protect, admin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.isDelivered = true;
    order.deliveredAt = new Date();
    order.status = 'Delivered';

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    console.error('Update order to delivered error:', error);
    res.status(500).json({ message: 'Server error while updating order delivery', error: error.message });
  }
});

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
router.put('/:id/cancel', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user owns the order or is admin
    if (order.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized to cancel this order' });
    }

    // Only allow cancellation of pending orders
    if (order.status !== 'Pending') {
      return res.status(400).json({ message: 'Cannot cancel order that is already processed' });
    }

    // Restore product stock
    for (const item of order.orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { countInStock: item.qty }
      });
    }

    order.status = 'Cancelled';
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ message: 'Server error while cancelling order', error: error.message });
  }
});

module.exports = router;