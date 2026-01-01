const express = require('express');
const router = express.Router();
const goalController = require('../controllers/goal.controller');
const authMiddleware = require('../middleware/auth.middleware');
const audit = require('../middleware/audit.middleware');

router.get('/', authMiddleware, goalController.getGoals);
router.post('/', authMiddleware, audit('GOAL_CREATE'), goalController.createGoal);
router.put('/:id', authMiddleware, audit('GOAL_UPDATE'), goalController.updateGoal);

module.exports = router;
