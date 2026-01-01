const fs = require('fs');
const path = require('path');
const Joi = require('joi');

const scenarioSchema = Joi.object({
    projectId: Joi.string().required(),
    name: Joi.string().min(2).required(),
    description: Joi.string().required(),
    status: Joi.string().valid('PROPOSED', 'APPROVED', 'REJECTED').default('PROPOSED'),
    tags: Joi.array().items(Joi.string()).optional()
});

const scenariosFilePath = path.join(__dirname, '../data/scenarios.json');

const getScenariosData = () => {
    try {
        const data = fs.readFileSync(scenariosFilePath, 'utf8');
        return JSON.parse(data);
    } catch (e) {
        return [];
    }
};

const saveScenariosData = (scenarios) => {
    fs.writeFileSync(scenariosFilePath, JSON.stringify(scenarios, null, 2));
};

exports.getScenariosByProject = (req, res, next) => {
    try {
        const { projectId } = req.params;
        const scenarios = getScenariosData();
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
        const scenarios = getScenariosData();

        const newScenario = {
            ...scenarioData,
            id: Date.now().toString(),
            userId,
            createdAt: new Date().toISOString()
        };

        scenarios.push(newScenario);
        saveScenariosData(scenarios);
        res.status(201).json(newScenario);
    } catch (error) {
        next(error);
    }
};

exports.deleteScenario = (req, res, next) => {
    try {
        const { id } = req.params;
        const scenarios = getScenariosData();
        const filtered = scenarios.filter(s => s.id !== id);

        if (scenarios.length === filtered.length) {
            const err = new Error('Scenario not found');
            err.statusCode = 404;
            throw err;
        }

        saveScenariosData(filtered);
        res.json({ message: 'Scenario deleted' });
    } catch (error) {
        next(error);
    }
};
