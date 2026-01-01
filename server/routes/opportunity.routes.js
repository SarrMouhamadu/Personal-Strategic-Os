const express = require('express');
const router = express.Router();
const opportunityController = require('../controllers/opportunity.controller');
const authMiddleware = require('../middleware/auth.middleware');
const audit = require('../middleware/audit.middleware');

router.get('/', authMiddleware, opportunityController.getAllOpportunities);
router.post('/', authMiddleware, audit('OPPORTUNITY_CREATE'), opportunityController.createOpportunity);
router.put('/:id', authMiddleware, audit('OPPORTUNITY_UPDATE'), opportunityController.updateOpportunity);
router.delete('/:id', authMiddleware, audit('OPPORTUNITY_DELETE'), opportunityController.deleteOpportunity);

module.exports = router;
