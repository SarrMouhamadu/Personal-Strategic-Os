const dbService = require('../services/db.service');

exports.getAllLogs = (req, res, next) => {
    try {
        const logs = dbService.read('audit_logs.json');
        // Sort by timestamp descending
        const sortedLogs = logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        res.json(sortedLogs);
    } catch (error) {
        next(error);
    }
};

exports.getSecurityReport = (req, res, next) => {
    try {
        const logs = dbService.read('audit_logs.json');
        const sensitiveAccess = logs.filter(l => l.action && l.action.includes('ACCESS'));
        const modifications = logs.filter(l => ['POST', 'PUT', 'DELETE'].includes(l.details.method));

        res.json({
            totalLogs: logs.length,
            sensitiveAccessCount: sensitiveAccess.length,
            modificationCount: modifications.length,
            latestLogs: logs.slice(-5)
        });
    } catch (error) {
        next(error);
    }
};
