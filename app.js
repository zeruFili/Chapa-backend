const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/User_Routes');
const paymentRoutes = require('./routes/Payment_Route');
const bankRoutes = require('./routes/Bank_Route');
const transactionRoutes = require('./routes/Transaction_Route');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const expressWinston = require('express-winston'); // Ensure express-winston is imported
const logger = require('./config/logger'); // Import your logger
require('dotenv').config();
const config = require('./config/config');
const app = express();
const cookieParser = require("cookie-parser");

// Middleware
app.use(express.json());
// app.use(cors({
//     origin: 'http://localhost:3000', // Replace with your frontend URL
//     credentials: true, // Allow cookies to be sent
// })); 
app.use(cookieParser());


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
mongoose.connect(config.dbConnection, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => logger.info('Database connected'))
  .catch(err => {
    logger.error('Database connection error:', err);
    process.exit(1); // Exit the process on connection error
  });

const PORT = config.port;

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
// const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});