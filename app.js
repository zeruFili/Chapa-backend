const express = require('express');
const mongoose = require('mongoose');
const movieRoutes = require('./routes/Movie_Routes');
const userRoutes = require('./routes/User_Routes');
const app = express();

app.use(express.json());

mongoose.connect('mongodb://0.0.0.0:27017/movie')
  .then(() => {

    console.log('Connected to MongoDB');

  })

  .catch((error) => {

    console.error('Error connecting to MongoDB', error);   
    
  });


app.use('/movie', movieRoutes);
app.use('/user', userRoutes);

app.listen(3001, () => {
  console.log('Server started on port 3000');
});