import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import usersRoutes from './routes/users.js';

dotenv.config({ path: '../../.env' });

const app = express();
const PORT = process.env.USERS_SERVICE_PORT || 5005;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Users Service: MongoDB connected'))
  .catch((err) => console.error('Users Service: MongoDB connection error', err));

// Routes
app.use('/api/users', usersRoutes);

// Health Check
app.get('/health', (req, res) => {
  res.json({ message: 'Users Service is running' });
});

app.listen(PORT, () => {
  console.log(`Users Service running on port ${PORT}`);
});
