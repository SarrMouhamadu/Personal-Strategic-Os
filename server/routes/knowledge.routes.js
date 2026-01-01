const express = require('express');
const router = express.Router();
const knowledgeController = require('../controllers/knowledge.controller');
const authMiddleware = require('../middleware/auth.middleware');
const audit = require('../middleware/audit.middleware');

router.get('/', authMiddleware, knowledgeController.getAllResources);
router.post('/', authMiddleware, audit('KNOWLEDGE_CREATE'), knowledgeController.createResource);
router.put('/:id', authMiddleware, audit('KNOWLEDGE_UPDATE'), knowledgeController.updateResource);
router.delete('/:id', authMiddleware, audit('KNOWLEDGE_DELETE'), knowledgeController.deleteResource);

module.exports = router;
