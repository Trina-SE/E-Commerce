import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import paymentsRoutes from './routes/payments.js';

dotenv.config({ path: '../../.env' });

const app = express();
const PORT = process.env.PAYMENTS_SERVICE_PORT || 5004;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Payments Service: MongoDB connected'))
  .catch((err) => console.error('Payments Service: MongoDB connection error', err));

// Routes
app.use('/api/payments', paymentsRoutes);

// Health Check
app.get('/health', (req, res) => {
  res.json({ message: 'Payments Service is running' });
});

app.listen(PORT, () => {
  console.log(`Payments Service running on port ${PORT}`);
});
