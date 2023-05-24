const router = require('express').Router();
const { NotFoundErr } = require('../errors/NotFoundErr');
const { createUser, signin, signout } = require('../controllers/users');
const {
  signUp,
  signIn,
} = require('../validation/validation');
const auth = require('../middlewares/auth');

router.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

router.post('/signup', signUp, createUser);
router.post('/signin', signIn, signin);

router.use(auth);
router.use('/', require('./users'));
router.use('/', require('./movies'));

router.post('/signout', signout);

router.use((req, res, next) => {
  next(new NotFoundErr('Страница не найдена'));
});

module.exports = router;