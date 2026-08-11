import axios from 'axios';

// Get API base URL from environment variable
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create re-usable Axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor to attach Authorization Bearer token dynamically
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API Services
export const authApi = {
  // Register user
  register: async (userData) => {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  },

  // Get current user profile
  getMe: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  }
};

// Trip API Services
export const tripApi = {
  // Fetch all trips
  getAllTrips: async () => {
    const response = await apiClient.get('/trips');
    return response.data;
  },

  // Fetch single trip by ID
  getTripById: async (id) => {
    const response = await apiClient.get(`/trips/${id}`);
    return response.data;
  },

  // Create new trip
  createTrip: async (tripData) => {
    const response = await apiClient.post('/trips', tripData);
    return response.data;
  },

  // Update trip
  updateTrip: async (id, tripData) => {
    const response = await apiClient.put(`/trips/${id}`, tripData);
    return response.data;
  },

  // Delete trip
  deleteTrip: async (id) => {
    const response = await apiClient.delete(`/trips/${id}`);
    return response.data;
  }
};

// Expense API Services
export const expenseApi = {
  // Create a new expense
  createExpense: async (expenseData) => {
    const response = await apiClient.post('/expenses', expenseData);
    return response.data;
  },

  // Get all expenses for a trip (includes budget summary)
  getExpensesByTrip: async (tripId) => {
    const response = await apiClient.get(`/expenses/trip/${tripId}`);
    return response.data;
  },

  // Update an expense
  updateExpense: async (id, expenseData) => {
    const response = await apiClient.put(`/expenses/${id}`, expenseData);
    return response.data;
  },

  // Delete an expense
  deleteExpense: async (id) => {
    const response = await apiClient.delete(`/expenses/${id}`);
    return response.data;
  }
};

// Itinerary API Services
export const itineraryApi = {
  // Generate a new AI itinerary for a trip (POST — calls OpenAI on the backend)
  generateItinerary: async (tripId) => {
    const response = await apiClient.post('/itinerary/generate', { tripId });
    return response.data;
  },

  // Fetch an existing saved itinerary for a trip
  getItinerary: async (tripId) => {
    const response = await apiClient.get(`/itinerary/${tripId}`);
    return response.data;
  }
};

export default apiClient;
