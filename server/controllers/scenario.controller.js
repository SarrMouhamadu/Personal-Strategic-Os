const dbService = require('../services/db.service');

exports.getScenariosByProject = (req, res, next) => {
    try {
        const { projectId } = req.params;
        const scenarios = dbService.read('scenarios.json');
        const projectScenarios = scenarios.filter(s => s.projectId === projectId);
        res.json(projectScenarios);
    } catch (error) {
        next(error);
    }
};

exports.createScenario = (req, res, next) => {
    try {
        const { error } = scenarioSchema.validate(req.body);
        if (error) {
            const err = new Error(error.details[0].message);
            err.statusCode = 400;
            throw err;
        }

        const userId = req.user.id;
        const scenarioData = req.body;
        const scenarios = dbService.read('scenarios.json');

        const newScenario = {
            ...scenarioData,
            id: Date.now().toString(),
            userId,
            createdAt: new Date().toISOString()
        };

        scenarios.push(newScenario);
        dbService.write('scenarios.json', scenarios);
        res.status(201).json(newScenario);
    } catch (error) {
        next(error);
    }
};

exports.deleteScenario = (req, res, next) => {
    try {
        const { id } = req.params;
        const scenarios = dbService.read('scenarios.json');
        const filtered = scenarios.filter(s => s.id !== id);

        if (scenarios.length === filtered.length) {
            const err = new Error('Scenario not found');
            err.statusCode = 404;
            throw err;
        }

        dbService.write('scenarios.json', filtered);
        res.json({ message: 'Scenario deleted' });
    } catch (error) {
        next(error);
    }
};
