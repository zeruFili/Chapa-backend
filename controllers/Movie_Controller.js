const Movie = require('../models/Movie_Model');

exports.createMovie = async (req, res) => {
  try {
    const {
      name,
      description,
      duration,
      raiting,
      genre,
      dimension,
      producer,
      writer,
      language,
      poster,
      trailer_link
    } = req.body;

    const movie = new Movie({
      name,
      description,
      duration,
      raiting,
      genre,
      dimension,
      producer,
      writer,
      language,
      poster,
      trailer_link
    });

    await movie.save();
    res.status(201).json(movie);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getMovies = async (req, res) => {
  try {
    const movies = await Movie.find();
    res.status(200).json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    res.status(200).json(movie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateMovie = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    const {
      name,
      description,
      duration,
      raiting,
      genre,
      dimension,
      producer,
      writer,
      language,
      poster,
      trailer_link
    } = req.body;

    movie.name = name;
    movie.description = description;
    movie.duration = duration;
    movie.raiting = raiting;
    movie.genre = genre;
    movie.dimension = dimension;
    movie.producer = producer;
    movie.writer = writer;
    movie.language = language;
    movie.poster = poster;
    movie.trailer_link = trailer_link;

    await movie.save();
    res.status(200).json(movie);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    res.status(204).json();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};