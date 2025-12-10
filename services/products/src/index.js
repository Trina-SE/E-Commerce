import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import productsRoutes from './routes/products.js';

dotenv.config({ path: '../../.env' });

const app = express();
const PORT = process.env.PRODUCTS_SERVICE_PORT || 5002;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Products Service: MongoDB connected'))
  .catch((err) => console.error('Products Service: MongoDB connection error', err));

// Routes
app.use('/api/products', productsRoutes);

// Health Check
app.get('/health', (req, res) => {
  res.json({ message: 'Products Service is running' });
});

app.listen(PORT, () => {
  console.log(`Products Service running on port ${PORT}`);
});
