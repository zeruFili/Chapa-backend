const express = require('express');
const app = express();
const httpStatus = require('http-status');
const { bankRoutes, paymentRoutes, transactionRoutes, userRoutes } = require('./routes');
const {successHandler, errorHandlers} = require('./config/morgan'); 
const cookieParser = require("cookie-parser");
const { errorHandler, errorConverter } = require('./middleware/error'); // Adjust the path as necessary
const ApiError = require('./utils/ApiError'); // Adjust the path as necessary
const cors = require('cors');
app.use(successHandler);
app.use(errorHandlers);

app.use(cors()); 


// Middleware to parse JSON
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/user', userRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/bank', bankRoutes);
app.use('/api/transaction', transactionRoutes);


// Handle unknown routes
app.use((req, res, next) => {
  next(new ApiError(httpStatus.default.NOT_FOUND, 'Not found'));
});

// Error handling middleware
app.use(errorConverter); // Convert error to ApiError
app.use(errorHandler); // Handle errors

module.exports = app; // Export the app for use in other files
