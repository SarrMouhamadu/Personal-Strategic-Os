const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contact.controller');
const authMiddleware = require('../middleware/auth.middleware');
const audit = require('../middleware/audit.middleware');

router.get('/', authMiddleware, contactController.getAllContacts);
router.post('/', authMiddleware, audit('CONTACT_CREATE'), contactController.createContact);
router.put('/:id', authMiddleware, contactController.updateContact);
router.delete('/:id', authMiddleware, audit('CONTACT_DELETE'), contactController.deleteContact);

// Interactions
router.post('/:id/interactions', authMiddleware, audit('CONTACT_INTERACTION_ADD'), contactController.addInteraction);

module.exports = router;
