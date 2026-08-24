import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor to attach Clerk token or guest identifier
let getAuthToken = null;
let currentUserId = null;

export const setAuthTokenGetter = (getter, userId) => {
  getAuthToken = getter;
  currentUserId = userId;
};

api.interceptors.request.use(async (config) => {
  try {
    if (getAuthToken) {
      const token = await getAuthToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    if (currentUserId) {
      config.headers['x-clerk-user-id'] = currentUserId;
    } else {
      // Check for local guest ID
      let guestId = localStorage.getItem('shopsphere_guest_id');
      if (!guestId) {
        guestId = `guest_${Math.random().toString(36).substring(2, 9)}`;
        localStorage.setItem('shopsphere_guest_id', guestId);
      }
      config.headers['x-guest-id'] = guestId;
    }
  } catch (error) {
    console.warn('Could not attach auth token to request:', error);
  }
  return config;
});

// ============================================================
// productService — fetches directly from the external product
// API on the client side (no backend needed). This makes the
// app work on Vercel without any Node.js server.
// ============================================================
export { clientProductService as productService } from './productClient';

export const orderService = {
  createOrder: async (orderData) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  getMyOrders: async () => {
    const response = await api.get('/orders/my-orders');
    return response.data;
  },

  getOrderById: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  getAllOrdersAdmin: async () => {
    const response = await api.get('/orders/admin/all');
    return response.data;
  },

  updateOrderStatusAdmin: async (id, status) => {
    const response = await api.patch(`/orders/${id}/status`, { status });
    return response.data;
  }
};

export const userService = {
  syncProfile: async (profileData) => {
    const response = await api.post('/user/sync', profileData);
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/user/profile');
    return response.data;
  }
};

export default api;
