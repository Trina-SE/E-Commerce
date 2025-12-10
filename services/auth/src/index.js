import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';

dotenv.config({ path: '../../.env' });

const app = express();
const PORT = process.env.AUTH_SERVICE_PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Auth Service: MongoDB connected'))
  .catch((err) => console.error('Auth Service: MongoDB connection error', err));

// Routes
app.use('/api/auth', authRoutes);

// Health Check
app.get('/health', (req, res) => {
  res.json({ message: 'Auth Service is running' });
});

app.listen(PORT, () => {
  console.log(`Auth Service running on port ${PORT}`);
});
