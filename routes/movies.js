const router = require('express').Router();
const {
  createMovies,
  deleteMovies,
  getMovies,
} = require('../controllers/movies');
const { validateMovies, validateId } = require('../middlewares/validation');

router.get('/', getMovies);
router.post('/', validateMovies, createMovies);
router.delete('/:movieId', validateId, deleteMovies);

module.exports = router;
