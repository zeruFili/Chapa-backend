const express = require('express');
const router = express.Router();
const movieController = require('../controllers/Movie_Controller');
const { protect , adminValidator} = require('../middleware/User_Validator')
// Create a new movie
router.post('/', protect,adminValidator, movieController.createMovie);

// Get all movies
router.get('/movies', movieController.getMovies);

// Get a single movie by ID
router.get('/movies/:id', movieController.getMovieById);

// Update a movie by ID
router.patch('/movies/:id', protect,adminValidator, movieController.updateMovie);

// Delete a movie by ID
router.delete('/movies/:id', protect,adminValidator, movieController.deleteMovie);

module.exports = router;