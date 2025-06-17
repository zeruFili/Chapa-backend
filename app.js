const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/User_Routes');
const paymentRoutes = require('./routes/Payment_Route');
const bankRoutes = require('./routes/Bank_Route');
const transactionRoutes = require('./routes/Transaction_Route');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const expressWinston = require('express-winston'); // Ensure express-winston is imported
const logger = require('./logger'); // Import your logger
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Request logging middleware
app.use(expressWinston.logger({
  winstonInstance: logger,
  meta: true, // Include meta data about the request
  msg: `HTTP {{req.method}} {{req.url}} - Response Time: {{res.responseTime}} ms`, // Log response time
  expressFormat: true,
  colorize: false, // Disable colorization
}));

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 35 * 60 * 1000,
  max: 100,
  message: 'Too many requests, please try again later.',
});
app.use(limiter);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://0.0.0.0:27017/chapa', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB', error);
  });

// Routes
app.use('/api/user', userRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/bank', bankRoutes);
app.use('/api/transaction', transactionRoutes);

// Error logging middleware
app.use(expressWinston.errorLogger({
  winstonInstance: logger,
  msg: 'Error: {{err.message}} - HTTP {{req.method}} {{req.url}} - Response Time: {{res.responseTime}} ms',
}));

// Use PORT from .env file or default to 3000
const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});