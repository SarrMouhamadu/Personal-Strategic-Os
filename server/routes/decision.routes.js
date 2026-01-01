const express = require('express');
const router = express.Router();
const decisionController = require('../controllers/decision.controller');
const authMiddleware = require('../middleware/auth.middleware');
const audit = require('../middleware/audit.middleware');

router.get('/', authMiddleware, decisionController.getDecisions);
router.post('/', authMiddleware, audit('DECISION_STORE'), decisionController.createDecision);

module.exports = router;
