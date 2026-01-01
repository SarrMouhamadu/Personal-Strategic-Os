const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware');
const audit = require('../middleware/audit.middleware');

router.patch('/role', authMiddleware, audit('ROLE_UPDATE'), userController.updateRole);

module.exports = router;
