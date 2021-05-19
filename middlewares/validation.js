const { celebrate, Joi, CelebrateError } = require('celebrate');
const { isURL } = require('validator');
const {
  invalidURL,
} = require('../utils/constants');

const headers = Joi.object().keys({
  authorization: Joi.string().required(),
}).unknown(true);

const validateUserUpdate = celebrate({
  headers,
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
});
const validateUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

const validateCreateUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
  }),
});

const validateId = celebrate({
  headers,
  params: Joi.object().keys({
  //   movieId: Joi.string().required(),
  // }),
    movieId: Joi.string().alphanum().hex().length(24)
      .required(),
  }),
});

const validateMovies = celebrate({
  headers,
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom((value) => {
      if (!isURL(value)) throw new CelebrateError(invalidURL);
      return value;
    }),
    trailerLink: Joi.string().required().custom((value) => {
      if (!isURL(value)) throw new CelebrateError(invalidURL);
      return value;
    }),
    thumbnail: Joi.string().required().custom((value) => {
      if (!isURL(value)) throw new CelebrateError(invalidURL);
      return value;
    }),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),

  }),
});

module.exports = {
  validateUserUpdate,
  validateId,
  validateMovies,
  validateCreateUser,
  validateUser,
};
