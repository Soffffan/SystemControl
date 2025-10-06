const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');
const { validateLogin } = require('../middleware/validation');
const { authLimiter } = require('../middleware/security');

//Публичные routes с ограничением попыток
router.post('/login', authLimiter, validateLogin, authController.login);

//Защищенные routes
router.get('/profile', auth, authController.getProfile);
router.post('/refresh', auth, authController.refreshToken);

module.exports = router;