const router = require('express').Router();
const {
  getUserInfo,
  updateUser,
} = require('../controllers/users');
const { updateUserValidation } = require('../validation/validation');

router.get('/users/me', getUserInfo);

router.patch('/users/me', updateUserValidation, updateUser);

module.exports = router;