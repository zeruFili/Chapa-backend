const express = require('express');
const app = express();
const { authRoutes, productRoutes, cartRoutes, paymentRoutes } = require('./routes'); // Import from the routes index file
const { errorHandler, errorConverter } = require('./middleware/error'); // Adjust the path as necessary
const ApiError = require('./utils/ApiError'); // Adjust the path as necessary
const httpStatus = require('http-status');
const { successHandler, errorHandlers } = require('./config/morgan');  
const cookieParser = require("cookie-parser");

app.use(successHandler);
app.use(errorHandlers);

// Middleware to parse JSON
app.use(express.json());
app.use(cookieParser());

// Define API routes
app.use('/api/auth', authRoutes); // Use authRoutes from index
app.use('/api/product', productRoutes); // Use productRoutes from index
app.use('/api/cart', cartRoutes); // Use cartRoutes from index
app.use('/api/payment', paymentRoutes); // Use paymentRoutes from index

// Handle unknown routes
app.use((req, res, next) => {
  next(new ApiError(httpStatus.default.NOT_FOUND, 'Not found'));
});

// Error handling middleware
app.use(errorConverter);
app.use(errorHandler);

module.exports = app; // Export the app