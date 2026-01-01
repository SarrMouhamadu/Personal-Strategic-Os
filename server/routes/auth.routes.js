const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const audit = require('../middleware/audit.middleware');

router.post('/register', audit('USER_REGISTER'), authController.register);
router.post('/login', audit('USER_LOGIN'), authController.login);

module.exports = router;
