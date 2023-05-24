const BadRequestErr = require('../errors/BadRequestErr');
const ConflictErr = require('../errors/ConflictErr');
const NotFoundErr = require('../errors/NotFoundErr');
const Movie = require('../models/movie');
const ForbiddenErr = require('../errors/ForbiddenErr');

const getMovies = async (req, res, next) => {
  try {
    const { _id: owner } = req.user;
    const movies = await Movie.find({ owner });
    return res.status(200).send(movies);
  } catch (error) {
    return error.name === 'ValidationError'
      ? next(new BadRequestErr('Невозможно отобразить список фильмов'))
      : next(error);
  }
};

const createMovie = async (req, res, next) => {
  try {
    const owner = req.user._id;
    const {
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      nameRU,
      nameEN,
      thumbnail,
      movieId,
    } = req.body;
    const movie = await Movie.create({
      owner,
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      nameRU,
      nameEN,
      thumbnail,
      movieId,
    });
    return res.status(200).send(movie);
  } catch (error) {
    if (error.code === 11000) {
      return next(new ConflictErr('Такой фильм уже существует'));
    }
    return error.name === 'CastError' || error.name === 'ValidationError'
      ? next(new BadRequestErr('Невозможно создать фильм'))
      : next(error);
  }
};

const deleteMovie = async (req, res, next) => {
  try {
    const owner = req.user._id;
    const { id } = req.params;
    const movie = await Movie.findById(id);
    if (!movie) {
      return next(new NotFoundErr('Фильм не найден'));
    }
    const isOwner = owner.toString() === movie.owner.toString();
    if (isOwner) {
      const deletedMovie = await Movie.findByIdAndRemove(id);
      return res.status(200).send(deletedMovie);
    }
    return next(new ForbiddenErr('Невозможно удалить фильм'));
  } catch (error) {
    return error.name === 'CastError'
      ? next(new BadRequestErr('Вы не можете удалить этот фильм'))
      : next(error);
  }
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};