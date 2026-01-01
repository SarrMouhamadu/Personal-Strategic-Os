const Joi = require('joi');
const dbService = require('../services/db.service');

const decisionSchema = Joi.object({
    title: Joi.string().min(3).required(),
    context: Joi.string().required(),
    options: Joi.array().items(Joi.string()).required(),
    outcome: Joi.string().required(),
    impactScore: Joi.number().min(0).max(10).required(),
    date: Joi.string().isoDate().optional(),
    tags: Joi.array().items(Joi.string()).optional()
});

exports.getDecisions = (req, res, next) => {
    try {
        const userId = req.user.id;
        const decisions = dbService.read('decisions.json');
        const userDecisions = decisions.filter(d => d.userId === userId);
        res.json(userDecisions);
    } catch (error) {
        next(error);
    }
};

exports.createDecision = (req, res, next) => {
    try {
        const { error } = decisionSchema.validate(req.body);
        if (error) {
            const err = new Error(error.details[0].message);
            err.statusCode = 400;
            throw err;
        }

        const userId = req.user.id;
        const decisionData = req.body;
        const decisions = dbService.read('decisions.json');

        const newDecision = {
            ...decisionData,
            id: Date.now().toString(),
            userId,
            date: decisionData.date || new Date().toISOString()
        };

        decisions.push(newDecision);
        dbService.write('decisions.json', decisions);
        res.status(201).json(newDecision);
    } catch (error) {
        next(error);
    }
};
