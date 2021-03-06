const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const UnauthorizedError = require('../errors/unauthorized-err');
const ConflictError = require('../errors/conflict-error');
const {
  notFoundUserIdError,
  isUserError,
  createUserError,
  updateProfileError,
  invalidMailOrPasswordError,
} = require('../utils/constants');

const { NODE_ENV, JWT_SECRET } = process.env;

const getCurrentUser = (req, res, next) => {
  console.log(req.user);
  const userId = mongoose.Types.ObjectId(req.user._id);
  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(notFoundUserIdError);
      }
      res.send(user);
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  console.log(req.body);
  const {
    name, email, password,
  } = req.body;
  User.findOne({ email }).exec()
    .then((user) => {
      if (user) {
        throw new ConflictError(isUserError);
      } else {
        bcrypt.hash(password, 10)
          .then((hash) => User.create({
            name, email, password: hash,
          }));
      }
    })
    .then((user) => {
      if (user) {
        throw new BadRequestError(createUserError);
      } res.send({
        data: {
          name, email,
        },
      });
    })
    .catch(next);
};

const updateProfile = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        throw new BadRequestError(updateProfileError);
      } res.send({ data: user });
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { password, email } = req.body;
  return User.findUserByCredentials(password, email)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );

      // ???????????? ??????????
      res.send({ token });
    })
    .catch(() => next(new UnauthorizedError(invalidMailOrPasswordError)));
};

module.exports = {
  createUser,
  updateProfile,
  login,
  getCurrentUser,
};
