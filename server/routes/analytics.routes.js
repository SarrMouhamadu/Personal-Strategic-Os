const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analytics.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.get('/annual-summary', authMiddleware, analyticsController.getAnnualSummary);

module.exports = router;
