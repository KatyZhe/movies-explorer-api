const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { isEmail } = require('validator');
const UnauthorizedErr = require('../errors/UnauthorizedErr');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validator: isEmail,
    message: 'Введите верный email',
  },
});

userSchema.statics.findUserByCredentials = async function findUserByCredentials(
  email,
  password
) {
  const user = await this.findOne({ email }).select('+password');
  if (!user) {
    return Promise.reject(new UnauthorizedErr('Неверный логин или пароль'));
  }
  return bcrypt.compare(password, user.password).then((matched) => {
    if (!matched) {
      return Promise.reject(new UnauthorizedErr('Неверный логин или пароль'));
    }
    return user;
  });
};

module.exports = mongoose.model('user', userSchema);
