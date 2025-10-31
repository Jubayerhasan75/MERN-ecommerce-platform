import express from 'express';
import Order from '../models/Order.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { 
      orderItems, 
      shippingAddress, 
      customerInfo, 
      totalPrice, 
      paymentMethod, 
      transactionId // Get the manual TrxID from frontend
    } = req.body;

    if (orderItems && orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    const order = new Order({
      orderItems,
      user: req.user._id,
      shippingAddress,
      customerInfo,
      totalPrice,
      paymentMethod,
      transactionId: transactionId || null, // Save the TrxID if it exists
      isPaid: false, // All orders start as unpaid
    });

    const createdOrder = await order.save();
    
    // Always return the created order (no redirect)
    res.status(201).json(createdOrder);

  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ message: 'Server error creating order' });
  }
});

// @desc    Get logged in user's orders
// @route   GET /api/orders/myorders
// @access  Private
router.get('/myorders', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching orders' });
  }
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (order) {
      if (req.user.isAdmin || order.user._id.equals(req.user._id)) {
        res.json(order);
      } else {
        res.status(401).json({ message: 'Not authorized to view this order' });
      }
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching order' });
  }
});

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
router.put('/:id/deliver', protect, admin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
      
      // Admin manually confirms payment when marking as delivered
      order.isPaid = true; 
      order.paidAt = Date.now();

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error updating order' });
  }
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', '_id name').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching all orders' });
  }
});

// @desc    Delete an order
// @route   DELETE /api/orders/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      await order.deleteOne();
      res.json({ message: 'Order removed' });
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error deleting order' });
  }
});

export default router;