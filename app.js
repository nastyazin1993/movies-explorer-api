require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const userRouter = require('./routes/users');
const moviesRouter = require('./routes/movies');
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');
const NotFoundError = require('./errors/not-found-err');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { validateUser, validateCreateUser } = require('./middlewares/validation');

const { PORT = 3000 } = process.env;
const app = express();

const hosts = [
  'http://localhost:3001',
  'http://localhost:3000',
  'https://nastyazin.students.nomoredomains.rocks',
  'https://api.nastyazin.students.nomoredomains.rocks',
  'https://www.api.nastyazin.students.nomoredomains.rocks',
  'https://www.nastyazin.students.nomoredomains.rocks',
];

mongoose.connect('mongodb://localhost:27017/bitfilmsdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(cors({ origin: hosts }));

app.use(requestLogger);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signup', validateCreateUser, createUser);
app.post('/signin', validateUser, login);
app.use(auth);
app.use('/users', auth, userRouter);
app.use('/movies', auth, moviesRouter);

app.use('*', (res, req, next) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден'));
});

app.use(errorLogger);

app.use(errors()); // обработчик ошибок celebrate

app.use((err, req, res, next) => {
  res.status(err.status || 500).send({ message: err.status === 500 ? 'Ошибка сервера' : err.message });
  next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
