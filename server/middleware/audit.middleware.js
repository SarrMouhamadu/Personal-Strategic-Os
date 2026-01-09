const crypto = require('crypto');
const db = require('../models');
const Audit = db.audits;

const logAction = async (action, details, user = 'System') => {
    try {
        await Audit.create({
            id: crypto.randomUUID(),
            timestamp: new Date(),
            userId: user,
            action,
            details
        });
    } catch (error) {
        console.error('Audit Log Error:', error);
    }
};

module.exports = (actionType) => {
    return (req, res, next) => {
        const cleanup = () => {
            res.removeListener('finish', logSuccess);
            res.removeListener('close', cleanup);
            res.removeListener('error', cleanup);
        };

        const logSuccess = () => {
            const user = req.user ? req.user.id : 'Anonymous';

            // For GET requests, we only log if explicitly requested (sensitive access)
            if (req.method === 'GET' && !actionType.includes('ACCESS')) {
                cleanup();
                return;
            }

            logAction(actionType, {
                method: req.method,
                path: req.originalUrl,
                ip: req.ip,
                statusCode: res.statusCode,
                params: req.params,
                query: req.query
            }, user);
            cleanup();
        };

        res.on('finish', logSuccess);
        res.on('close', cleanup);
        res.on('error', cleanup);

        next();
    };
};
