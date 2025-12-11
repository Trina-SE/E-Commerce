import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth Services
export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  verify: () => api.post('/auth/verify'),
  getCurrentUser: () => api.get('/auth/me'),
};

// Product Services
export const productService = {
  getAll: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
  addReview: (id, data) => api.post(`/products/${id}/reviews`, data),
  getCategories: () => api.get('/products/categories/list'),
};

// Order Services
export const orderService = {
  create: (data) => api.post('/orders', data),
  getUserOrders: (userId) => api.get(`/orders/user/${userId}`),
  getById: (id) => api.get(`/orders/${id}`),
  updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
  cancel: (id) => api.put(`/orders/${id}/cancel`),
};

// Payment Services
export const paymentService = {
  process: (data) => api.post('/payments/process', data),
  getByOrderId: (orderId) => api.get(`/payments/${orderId}`),
  getUserPayments: (userId) => api.get(`/payments/user/${userId}`),
  refund: (orderId, amount) => api.post(`/payments/${orderId}/refund`, { refundAmount: amount }),
};

// User Services
export const userService = {
  getProfile: (userId) => api.get(`/users/${userId}`),
  updateProfile: (userId, data) => api.put(`/users/${userId}`, data),
  addAddress: (userId, data) => api.post(`/users/${userId}/addresses`, data),
  updateAddress: (userId, index, data) => api.put(`/users/${userId}/addresses/${index}`, data),
  deleteAddress: (userId, index) => api.delete(`/users/${userId}/addresses/${index}`),
  addToWishlist: (userId, productId) => api.post(`/users/${userId}/wishlist/${productId}`),
  removeFromWishlist: (userId, productId) => api.delete(`/users/${userId}/wishlist/${productId}`),
};

// Complaint Services
export const complaintService = {
  uploadPdf: (formData) =>
    api.post('/complaints/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  list: () => api.get('/complaints'),
};

export default api;
