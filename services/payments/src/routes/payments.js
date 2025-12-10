import express from 'express';
import Payment from '../models/Payment.js';
import axios from 'axios';

const router = express.Router();

// Process payment
router.post('/process', async (req, res) => {
  try {
    const { orderId, userId, amount, paymentMethod, cardDetails } = req.body;

    if (!orderId || !userId || !amount || !paymentMethod) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const payment = new Payment({
      orderId,
      userId,
      amount,
      paymentMethod,
      status: 'processing',
      cardDetails: cardDetails || {},
    });

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // In production, integrate with Stripe or PayPal here
    payment.status = 'completed';
    payment.transactionId = `TXN_${Date.now()}`;

    await payment.save();

    // Update order payment status in orders service
    try {
      await axios.put(
        `http://localhost:5003/api/orders/${orderId}/payment-status`,
        {
          paymentStatus: 'completed',
          transactionId: payment.transactionId,
        }
      );
    } catch (error) {
      console.error('Error updating order payment status:', error.message);
    }

    res.status(201).json({
      message: 'Payment processed successfully',
      payment,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error processing payment', error: error.message });
  }
});

// Get payment details
router.get('/:orderId', async (req, res) => {
  try {
    const payment = await Payment.findOne({ orderId: req.params.orderId });
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching payment', error: error.message });
  }
});

// Get user payments
router.get('/user/:userId', async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching payments', error: error.message });
  }
});

// Refund payment
router.post('/:orderId/refund', async (req, res) => {
  try {
    const { refundAmount } = req.body;
    const payment = await Payment.findOne({ orderId: req.params.orderId });

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    if (payment.status === 'refunded') {
      return res.status(400).json({ message: 'Payment already refunded' });
    }

    payment.status = 'refunded';
    payment.refundAmount = refundAmount || payment.amount;
    payment.refundTransactionId = `REFUND_${Date.now()}`;

    await payment.save();

    res.json({
      message: 'Payment refunded successfully',
      payment,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error refunding payment', error: error.message });
  }
});

// Get all payments (admin)
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const skip = (page - 1) * limit;

    let filter = {};
    if (status) filter.status = status;

    const total = await Payment.countDocuments(filter);
    const payments = await Payment.find(filter)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    res.json({
      payments,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching payments', error: error.message });
  }
});

export default router;
