const express = require('express');
const router = express.Router();
const auditController = require('../controllers/audit.controller');
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware');

router.get('/', authMiddleware, roleMiddleware(['ADMIN', 'CSO', 'PRIVATE']), auditController.getAllLogs);
router.get('/security-report', authMiddleware, roleMiddleware(['ADMIN', 'CSO', 'PRIVATE']), auditController.getSecurityReport);

module.exports = router;
