const router = require('express').Router();
const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');
const {
  createFilmValidation,
  filmIdValidation,
} = require('../validation/validation');

router.get('/movies', getMovies);

router.post('/movies', createFilmValidation, createMovie);

router.delete('/movies/:movieId', filmIdValidation, deleteMovie);

module.exports = router;