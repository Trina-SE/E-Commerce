import express from 'express';
import httpProxy from 'express-http-proxy';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

const app = express();
const PORT = process.env.GATEWAY_PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Service URLs
const AUTH_SERVICE = 'http://localhost:5001';
const PRODUCTS_SERVICE = 'http://localhost:5002';
const ORDERS_SERVICE = 'http://localhost:5003';
const PAYMENTS_SERVICE = 'http://localhost:5004';
const USERS_SERVICE = 'http://localhost:5005';

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ message: 'API Gateway is running' });
});

// Auth Service Routes
app.use('/api/auth', httpProxy(AUTH_SERVICE, {
  proxyReqPathResolver: (req) => `/api/auth${req.url}`,
}));

// Products Service Routes
app.use('/api/products', httpProxy(PRODUCTS_SERVICE, {
  proxyReqPathResolver: (req) => `/api/products${req.url}`,
}));

// Orders Service Routes
app.use('/api/orders', httpProxy(ORDERS_SERVICE, {
  proxyReqPathResolver: (req) => `/api/orders${req.url}`,
}));

// Payments Service Routes
app.use('/api/payments', httpProxy(PAYMENTS_SERVICE, {
  proxyReqPathResolver: (req) => `/api/payments${req.url}`,
}));

// Users Service Routes
app.use('/api/users', httpProxy(USERS_SERVICE, {
  proxyReqPathResolver: (req) => `/api/users${req.url}`,
}));

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error('Gateway Error:', err.message);
  res.status(500).json({ message: 'Gateway error', error: err.message });
});

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
  console.log(`Available at http://localhost:${PORT}`);
});
