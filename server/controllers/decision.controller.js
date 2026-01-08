const Joi = require('joi');
const db = require('../models');
const Decision = db.decisions;

const decisionSchema = Joi.object({
    title: Joi.string().min(3).required(),
    context: Joi.string().required(),
    options: Joi.array().items(Joi.string()).required(),
    outcome: Joi.string().required(),
    impactScore: Joi.number().min(0).max(10).required(),
    date: Joi.string().isoDate().optional(),
    tags: Joi.array().items(Joi.string()).optional()
});

exports.getDecisions = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const decisions = await Decision.findAll({ where: { userId } });
        res.json(decisions);
    } catch (error) {
        next(error);
    }
};

exports.createDecision = async (req, res, next) => {
    try {
        const { error } = decisionSchema.validate(req.body);
        if (error) {
            const err = new Error(error.details[0].message);
            err.statusCode = 400;
            throw err;
        }

        const userId = req.user.id;
        const decisionData = req.body;

        const newDecision = await Decision.create({
            ...decisionData,
            id: Date.now().toString(),
            userId,
            date: decisionData.date || new Date().toISOString()
        });

        res.status(201).json(newDecision);
    } catch (error) {
        next(error);
    }
};
