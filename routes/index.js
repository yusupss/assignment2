const router = require('express').Router();
const todosRouter = require('./todos-router');
const errorHandler = require('./../middlewares/error-handler-middleware');
const RegisterController = require('../controllers/register-controller');
const SignInController = require('../controllers/sign-in-controller');
const authenticationMiddleware = require('../middlewares/authentication-middleware');

// GET /
router.get('/', (req, res) => {
  res.status(201).json({
    message: "welcome to assignment2"
  });
});

// POST /sign-in
router.post('/sign-in', SignInController.signIn);

// POST /register
router.post('/register', RegisterController.register);

router.use(authenticationMiddleware);

router.use('/todos', todosRouter);

router.use(errorHandler);

module.exports = router;