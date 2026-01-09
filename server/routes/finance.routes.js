const express = require('express');
const router = express.Router();
const financeController = require('../controllers/finance.controller');
const authMiddleware = require('../middleware/auth.middleware');
const multer = require('multer');
const path = require('path');

// Multer Config for Finance Receipts
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/finance/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

router.post('/', authMiddleware, financeController.createExpense);
router.get('/', authMiddleware, financeController.getAllExpenses);
router.get('/strategic-summary', authMiddleware, financeController.getStrategicSummary);
router.delete('/:id', authMiddleware, financeController.deleteExpense);

// Receipt Upload
router.post('/upload-receipt', authMiddleware, upload.single('receipt'), (req, res) => {
    if (!req.file) return res.status(400).send('No file uploaded.');
    res.json({ url: `/uploads/finance/${req.file.filename}` });
});

module.exports = router;
