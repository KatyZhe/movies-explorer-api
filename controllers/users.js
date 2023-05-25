const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { JWT_SECRET, NODE_ENV } = require('../config');
const BadRequestErr = require('../errors/BadRequestErr');
const ConflictErr = require('../errors/ConflictErr');
const NotFoundErr = require('../errors/NotFoundErr');

const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findUserByCredentials(email, password);
    const token = jwt.sign(
      { _id: user._id },
      NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
      { expiresIn: '7d' }
    );
    return res
      .cookie('jwt', token, {
        httpOnly: true,
        maxAge: 6.048e8,
        sameSite: 'none',
        secure: true,
      })
      .status(200)
      .send({ message: 'Пользователь авторизован' });
  } catch (error) {
    return next(error);
  }
};

const signout = async (req, res, next) => {
  try {
    res.clearCookie('jwt', {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });
    return res.status(200).send({ message: 'Пользователь вышел из аккаунта' });
  } catch (error) {
    return next(error);
  }
};

const createUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hash,
    });
    return res.status(200).send({
          name: user.name,
          _id: user._id,
          email: user.email,
        })
  } catch (error) {
    if (error.name === 'ValidationError') {
      return next(new BadRequestErr('Данные введены неверно'));
    }
    if (error.code === 11000) {
      return next(new ConflictErr('Пользователь уже зарегестрирован'));
    }
    return next(error);
  }
};

const getUserInfo = async (req, res, next) => {
  try {
    const userInfo = await User.findById(req.user._id);
    return userInfo
      ? res.status(200).send(userInfo)
      : next(new NotFoundErr('Пользователь не найден'));
  } catch (error) {
    return next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, email },
      {
        new: true,
        runValidators: true,
      }
    );
    return res.status(200).send({
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    if (error.name === 'CastError' || error.name === 'ValidationError') {
      return next(new BadRequestErr('Введите корректные данные'));
    }
    return next(error);
  }
};

module.exports = {
  createUser,
  getUserInfo,
  updateUser,
  signin,
  signout,
};
