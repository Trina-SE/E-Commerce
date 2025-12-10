import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    userId: {
      type: String,
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'USD',
    },
    paymentMethod: {
      type: String,
      enum: ['card', 'paypal', 'bank_transfer', 'wallet'],
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
      default: 'pending',
    },
    transactionId: {
      type: String,
      unique: true,
      sparse: true,
    },
    paymentGateway: {
      type: String,
      enum: ['stripe', 'paypal', 'local'],
      default: 'local',
    },
    cardDetails: {
      lastFour: String,
      brand: String,
    },
    failureReason: String,
    refundAmount: {
      type: Number,
      default: 0,
    },
    refundTransactionId: String,
  },
  { timestamps: true }
);

export default mongoose.model('Payment', paymentSchema);
