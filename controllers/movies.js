const Movies = require('../models/movie');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const ForbiddenError = require('../errors/forbiden-error');
const {
  notFounDataError,
  createMovieError,
  notFoundMovieIdError,
  ownerCardError,
} = require('../utils/constants');

const getMovies = (req, res, next) => {
  Movies.find()
    .then((data) => {
      if (!data) {
        throw new NotFoundError(notFounDataError);
      } res.send(data);
    })
    .catch(next);
};

const createMovies = (req, res, next) => {
  const { _id } = req.user;
  const {
    country,
    director, duration, year, description, image, trailerLink, nameRU, nameEN, thumbnail, movieId,
  } = req.body;
  Movies.create({
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
    owner: _id,
    movieId,
  })
    .then((movie) => {
      if (!movie) {
        throw new BadRequestError(createMovieError);
      } res.send({ data: movie });
    })
    .catch(next);
};

const deleteMovies = (req, res, next) => {
  const { movieId } = req.params;
  Movies.findById(movieId)
    .then((movie) => {
      console.log(movie);
      if (!movie) {
        throw new NotFoundError(notFoundMovieIdError);
      }
      const userId = req.user._id;
      const movieOwnerId = String(movie.owner);
      console.log(userId);
      console.log(movieOwnerId);
//<<<<<<< HEAD
//<<<<<<< HEAD
      if (movieOwnerId !== userId) {
       throw new ForbiddenError(ownerCardError);
      }
//=======
      // if (movieOwnerId !== userId) {
      //   throw new ForbiddenError(ownerCardError);
      // }
//>>>>>>> a64150ddc3faadd6015f80dc8630d380a174eef4
//=======
      if (movieOwnerId !== userId) {
        throw new ForbiddenError(ownerCardError);
      }
//>>>>>>> b33b99acb0c0f4c458e3a1c20d0e2664018cd338
      movie.remove();
      res.send({ data: movie });
    })
    .catch(next);
};

module.exports = {
  createMovies,
  deleteMovies,
  getMovies,
};
