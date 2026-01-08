const db = require('../models');
const Audit = db.audits;

exports.getAllLogs = async (req, res, next) => {
    try {
        const logs = await Audit.findAll({
            order: [['timestamp', 'DESC']]
        });
        res.json(logs);
    } catch (error) {
        next(error);
    }
};

exports.getSecurityReport = async (req, res, next) => {
    try {
        const logs = await Audit.findAll({
            order: [['timestamp', 'DESC']]
        });
        
        const sensitiveAccess = logs.filter(l => l.action && l.action.includes('ACCESS'));
        const modifications = logs.filter(l => l.details && ['POST', 'PUT', 'DELETE'].includes(l.details.method));

        res.json({
            totalLogs: logs.length,
            sensitiveAccessCount: sensitiveAccess.length,
            modificationCount: modifications.length,
            latestLogs: logs.slice(0, 5)
        });
    } catch (error) {
        next(error);
    }
};
