require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const helmet = require('helmet');

const router = require("./routes/index");
const errorHandler = require('./middlewares/errorHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const cors = require('./middlewares/cors')

const { PORT = 3000 } = process.env;
const app = express();
const MONGO_URL_DEV = 'mongodb://127.0.0.1:27017/moviesdb';
const { NODE_ENV, MONGO_URL } = process.env;

mongoose.connect(NODE_ENV === 'production' ? MONGO_URL : MONGO_URL_DEV, {
  family: 4,
});

app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);
app.use(cors);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
}); 

app.use(router);

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server starts on ${PORT}`);
});
