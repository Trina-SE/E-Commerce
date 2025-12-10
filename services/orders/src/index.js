import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import ordersRoutes from './routes/orders.js';

dotenv.config({ path: '../../.env' });

const app = express();
const PORT = process.env.ORDERS_SERVICE_PORT || 5003;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Orders Service: MongoDB connected'))
  .catch((err) => console.error('Orders Service: MongoDB connection error', err));

// Routes
app.use('/api/orders', ordersRoutes);

// Health Check
app.get('/health', (req, res) => {
  res.json({ message: 'Orders Service is running' });
});

app.listen(PORT, () => {
  console.log(`Orders Service running on port ${PORT}`);
});
