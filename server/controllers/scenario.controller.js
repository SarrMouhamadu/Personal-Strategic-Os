const Joi = require('joi');
const db = require('../models');
const Scenario = db.scenarios;

const scenarioSchema = Joi.object({
    projectId: Joi.string().required(),
    name: Joi.string().min(2).required(),
    description: Joi.string().required(),
    status: Joi.string().valid('PROPOSED', 'APPROVED', 'REJECTED').default('PROPOSED'),
    tags: Joi.array().items(Joi.string()).optional()
});

exports.getScenariosByProject = async (req, res, next) => {
    try {
        const { projectId } = req.params;
        const scenarios = await Scenario.findAll({ where: { projectId } });
        res.json(scenarios);
    } catch (error) {
        next(error);
    }
};

exports.createScenario = async (req, res, next) => {
    try {
        const { error } = scenarioSchema.validate(req.body);
        if (error) {
            const err = new Error(error.details[0].message);
            err.statusCode = 400;
            throw err;
        }

        const userId = req.user.id;
        const scenarioData = req.body;

        const newScenario = await Scenario.create({
            ...scenarioData,
            id: Date.now().toString(),
            userId
        });

        res.status(201).json(newScenario);
    } catch (error) {
        next(error);
    }
};

exports.deleteScenario = async (req, res, next) => {
    try {
        const { id } = req.params;
        
        const scenario = await Scenario.findByPk(id);
        if (!scenario) {
            const err = new Error('Scenario not found');
            err.statusCode = 404;
            throw err;
        }

        await scenario.destroy();
        res.json({ message: 'Scenario deleted' });
    } catch (error) {
        next(error);
    }
};
