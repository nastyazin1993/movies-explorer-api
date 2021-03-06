require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const router = require('./routes/index');
const centralizedErrorHandler = require('./middlewares/error-handler');
const rateLimiter = require('./middlewares/rateLimit');
const {
  crashError,
} = require('./utils/constants');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;
const { MONGO_URL = 'mongodb://localhost:27017/bitfilmsdb' } = process.env;
const app = express();

const hosts = [
  'http://localhost:3001',
  'http://localhost:3000',
  'https://nastyazin.students.nomoredomains.rocks',
  'https://api.nastyazin.students.nomoredomains.rocks',
  'https://www.api.nastyazin.students.nomoredomains.rocks',
  'https://www.nastyazin.students.nomoredomains.rocks',
  'https://api.nomoreparties.co/beatfilm-movies',
];

const mongoUrl = MONGO_URL || 'mongodb://localhost:27017/bitfilmsdb';

mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

// app.use((req, res, next) => {
//   const { origin } = req.headers;
//   if (hosts.includes(origin)) { // Проверяем, что значение origin есть среди разрешённых доменов
//     res.header('Access-Control-Allow-Origin', origin);
//   }

//   next();
// });
app.use(cors({ origin: hosts }));
app.use(requestLogger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(rateLimiter);
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error(crashError);
  }, 0);
});
app.use('/', router);
app.use(errorLogger);
app.use(errors());
app.use(centralizedErrorHandler);
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
