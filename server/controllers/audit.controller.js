const fs = require('fs');
const path = require('path');

const logsFilePath = path.join(__dirname, '../data/audit_logs.json');

const getLogsData = () => {
    try {
        const data = fs.readFileSync(logsFilePath, 'utf8');
        return JSON.parse(data);
    } catch (e) {
        return [];
    }
};

exports.getAllLogs = (req, res) => {
    try {
        const logs = getLogsData();
        // Sort by timestamp descending
        const sortedLogs = logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        res.json(sortedLogs);
    } catch (error) {
        next(error);
    }
};

exports.getSecurityReport = (req, res) => {
    try {
        const logs = getLogsData();
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
