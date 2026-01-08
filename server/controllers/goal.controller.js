const Joi = require('joi');
const db = require('../models');
const Goal = db.goals;

const goalSchema = Joi.object({
    type: Joi.string().valid('ANNUAL', 'QUARTERLY').default('ANNUAL'),
    year: Joi.number().integer().min(2020).max(2100).required(),
    quarter: Joi.number().integer().min(1).max(4).optional(),
    title: Joi.string().min(3).required(),
    description: Joi.string().allow('').optional(),
    status: Joi.string().valid('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'AT_RISK').default('NOT_STARTED'),
    progress: Joi.number().min(0).max(100).default(0),
    keyResults: Joi.array().items(Joi.object({
        id: Joi.string().required(),
        description: Joi.string().required(),
        targetValue: Joi.number().required(),
        currentValue: Joi.number().default(0),
        unit: Joi.string().required()
    })).optional()
});

exports.getGoals = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const year = parseInt(req.query.year) || new Date().getFullYear();
        const goals = await Goal.findAll({ where: { userId, year } });
        res.json(goals);
    } catch (error) {
        next(error);
    }
};

exports.createGoal = async (req, res, next) => {
    try {
        const { error } = goalSchema.validate(req.body);
        if (error) {
            const err = new Error(error.details[0].message);
            err.statusCode = 400;
            throw err;
        }

        const userId = req.user.id;
        const goalData = req.body;

        const newGoal = await Goal.create({
            ...goalData,
            id: Date.now().toString(),
            userId
        });

        res.status(201).json(newGoal);
    } catch (error) {
        next(error);
    }
};

exports.updateGoal = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        const goal = await Goal.findOne({ where: { id, userId } });
        if (!goal) {
            const err = new Error('Goal not found');
            err.statusCode = 404;
            throw err;
        }

        const { error } = goalSchema.validate({ ...goal.toJSON(), ...req.body });
        if (error) {
            const err = new Error(error.details[0].message);
            err.statusCode = 400;
            throw err;
        }

        await goal.update(req.body);
        res.json(goal);
    } catch (error) {
        next(error);
    }
};
