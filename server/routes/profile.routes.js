const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profile.controller');
const authMiddleware = require('../middleware/auth.middleware');
const audit = require('../middleware/audit.middleware');

router.get('/', authMiddleware, profileController.getProfile);
router.put('/', authMiddleware, audit('PROFILE_UPDATE'), profileController.updateProfile);

module.exports = router;
