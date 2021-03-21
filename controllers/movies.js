const Movies = require('../models/movie');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const ForbiddenError = require('../errors/forbiden-error');

const getMovies = (req, res, next) => {
  Movies.find()
    .then((data) => {
      if (!data) {
        throw new NotFoundError('Запрашиваемый ресурс не найден');
      } res.send(data);
    })
    .catch(next);
};

const createMovies = (req, res, next) => {
  const { _id } = req.user;
  const {
    country,
    director, duration, year, description, image, trailer, nameRU, nameEN, thumbnail, movieId,
  } = req.body;
  Movies.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    owner: _id,
    movieId,
  })
    .then((movie) => {
      if (!movie) {
        throw new BadRequestError('Переданы некорректные данные');
      } res.send({ data: movie });
    })
    .catch(next);
};

const deleteMovies = (req, res, next) => {
  Movies.find({ movieId: req.params.movieId })
    .then((movie) => {
      console.log(movie);
      if (!movie) {
        throw new NotFoundError('Нет Фильма с таким id');
      }
      const userId = req.user._id;
      const movieOwnerId = String(movie[0].owner);
      console.log(userId);
      console.log(movieOwnerId);
      if (movieOwnerId !== userId) {
        throw new ForbiddenError('Запрещено!Вы не являетесь владельцем карточки!');
      }
      movie[0].remove();
      res.send({ data: movie });
    })
    .catch(next);
};

module.exports = {
  createMovies,
  deleteMovies,
  getMovies,
};
