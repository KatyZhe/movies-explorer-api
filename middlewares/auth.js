require('dotenv').config();
const jwt = require('jsonwebtoken');
const UnauthorizedErr = require('../errors/UnauthorizedErr');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new UnauthorizedErr('Необходима авторизация.'));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'diploma-secret-key');
  } catch (err) {
    return next(new UnauthorizedErr('Необходима авторизация.'));
  }

  req.user = payload;

  return next();
};