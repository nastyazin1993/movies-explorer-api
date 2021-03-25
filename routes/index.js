const router = require('express').Router();
const userRouter = require('./users');
const moviesRouter = require('./movies');
const { createUser, login } = require('../controllers/users');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/not-found-err');
const { validateUser, validateCreateUser } = require('../middlewares/validation');
const {
  notFoundError,
} = require('../utils/constants');

router.post('/signup', validateCreateUser, createUser);
router.post('/signin', validateUser, login);
router.use(auth);
router.use('/users', auth, userRouter);
router.use('/movies', auth, moviesRouter);
router.use('*', (res, req, next) => {
  next(new NotFoundError(notFoundError));
});

module.exports = router;
