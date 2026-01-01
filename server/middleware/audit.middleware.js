const fs = require('fs');
const path = require('path');

const logsFilePath = path.join(__dirname, '../data/audit_logs.json');

const logAction = (action, details, user = 'System') => {
    try {
        const data = fs.readFileSync(logsFilePath, 'utf8');
        const logs = JSON.parse(data);

        const newLog = {
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            user,
            action,
            details
        };

        logs.push(newLog);
        fs.writeFileSync(logsFilePath, JSON.stringify(logs, null, 2));
    } catch (error) {
        console.error('Audit Log Error:', error);
    }
};

module.exports = (actionType) => {
    return (req, res, next) => {
        // Intercept the end of the request to log success
        const cleanup = () => {
            res.removeListener('finish', logSuccess);
            res.removeListener('close', cleanup);
            res.removeListener('error', cleanup);
        };

        const logSuccess = () => {
            const user = req.user ? req.user.email : (req.body.email || 'Anonymous');

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
