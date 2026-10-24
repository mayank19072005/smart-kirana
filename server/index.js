const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(morgan('dev'));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/analytics', require('./routes/analytics'));

app.get('/', (req, res) => {
  res.json({
    message: "Welcome to Smart-Kirana API v2.0 - Live & Updated",
    status: "online",
    dbStatus: mongoose.connection.readyState === 1 ? "connected" : "disconnected"
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({
    status: "ok",
    dbStatus: mongoose.connection.readyState === 1 ? "connected" : "disconnected"
  });
});

// Database Connection
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-kirana';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
  })
  .catch(err => {
    console.error('❌ Database connection error:', err.message);
    console.warn('⚠️ Server is running, but database connection failed. Please ensure MONGODB_URI is correctly configured in your environment variables.');
  });

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

