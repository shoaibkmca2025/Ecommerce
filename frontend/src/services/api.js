import axios from 'axios';
import config from '../config/config';

const API_URL = config.API_URL;

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Product API calls
export const productAPI = {
  // Get all products
  getProducts: () => api.get('/products'),
  
  // Get single product
  getProduct: (id) => api.get(`/products/${id}`),
  
  // Create product (admin only)
  createProduct: (productData) => api.post('/products', productData),
  
  // Update product (admin only)
  updateProduct: (id, productData) => api.put(`/products/${id}`, productData),
  
  // Delete product (admin only)
  deleteProduct: (id) => api.delete(`/products/${id}`),
};

// User API calls
export const userAPI = {
  // Register user
  register: (userData) => api.post('/users/register', userData),
  
  // Login user
  login: (credentials) => api.post('/users/login', credentials),
  
  // Get user profile
  getProfile: () => api.get('/users/profile'),
  
  // Update user profile
  updateProfile: (userData) => api.put('/users/profile', userData),
};

// Health check
export const healthCheck = () => api.get('/health');

export default api;
