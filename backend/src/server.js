const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = require('./config/db');
const tripRoutes = require('./routes/tripRoutes');
const authRoutes = require('./routes/authRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const itineraryRoutes = require('./routes/itineraryRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(cors());

// Body Parsing Middleware
app.use(express.json());

// Connect to Database
connectDB();

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/itinerary', itineraryRoutes);

// Helper to translate Mongoose readiness state
const getDbState = () => {
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };
  return states[mongoose.connection.readyState] || 'unknown';
};

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  const dbStatus = getDbState();
  res.status(200).json({
    status: 'OK',
    message: 'TripSync AI Backend is up and running!',
    timestamp: new Date().toISOString(),
    database: {
      status: dbStatus,
      isConnected: mongoose.connection.readyState === 1
    }
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`[TripSync Backend] Server running on port ${PORT}`);
  console.log(`[Health Check] GET http://localhost:${PORT}/api/health`);
});
