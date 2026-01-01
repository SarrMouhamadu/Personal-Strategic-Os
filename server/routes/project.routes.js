const express = require('express');
const router = express.Router();
const projectController = require('../controllers/project.controller');
const authMiddleware = require('../middleware/auth.middleware');
const audit = require('../middleware/audit.middleware');

router.get('/', authMiddleware, projectController.getProjects);
router.get('/:id', authMiddleware, audit('PROJECT_ACCESS'), projectController.getProjectById);
router.post('/', authMiddleware, audit('PROJECT_CREATE'), projectController.createProject);
router.put('/:id', authMiddleware, audit('PROJECT_UPDATE'), projectController.updateProject);
router.delete('/:id', authMiddleware, audit('PROJECT_ARCHIVE'), projectController.archiveProject);

module.exports = router;
