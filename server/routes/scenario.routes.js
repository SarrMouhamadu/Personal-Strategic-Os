const express = require('express');
const router = express.Router();
const scenarioController = require('../controllers/scenario.controller');
const authMiddleware = require('../middleware/auth.middleware');
const audit = require('../middleware/audit.middleware');

router.get('/project/:projectId', authMiddleware, scenarioController.getScenariosByProject);
router.post('/', authMiddleware, audit('SCENARIO_CREATE'), scenarioController.createScenario);
router.delete('/:id', authMiddleware, audit('SCENARIO_DELETE'), scenarioController.deleteScenario);

module.exports = router;
