const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/User_Routes');
const paymentRoutes = require('./routes/Payment_Route');
const cors = require("cors");
require('dotenv').config(); // Load environment variables from .env file

const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect('mongodb://0.0.0.0:27017/chapa')
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB', error);
  });


app.use('/api/user', userRoutes);
app.use('/api/payment', paymentRoutes);

// Use PORT from .env file or default to 3000
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});