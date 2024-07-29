const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  raiting: {
    type: String,
    required: true
  },
  genre: {
    type: String,
    required: true
  },
  dimension: {
    type: String,
    required: true
  },
  producer: {
    type: String,
    required: true
  },
  writer: {
    type: String,
    required: true
  },
  language: {
    type: String,
    required: true
  },
  poster: {
    type: String,
    required: true
  },
  trailer_link: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;