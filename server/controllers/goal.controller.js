const Joi = require('joi');
const dbService = require('../services/db.service');

const goalSchema = Joi.object({
    title: Joi.string().min(3).required(),
    targetValue: Joi.number().required(),
    currentValue: Joi.number().optional(),
    unit: Joi.string().required(),
    deadline: Joi.string().isoDate().required(),
    category: Joi.string().valid('PERSONAL', 'PROFESSIONAL', 'FINANCIAL', 'NETWORK').required(),
    status: Joi.string().valid('TODO', 'IN_PROGRESS', 'COMPLETED').default('TODO'),
    year: Joi.number().integer().min(2020).max(2100).required()
});

exports.getGoals = (req, res, next) => {
    try {
        const userId = req.user.id;
        const year = parseInt(req.query.year) || new Date().getFullYear();
        const goals = dbService.read('goals.json');
        const userGoals = goals.filter(g => g.userId === userId && g.year === year);
        res.json(userGoals);
    } catch (error) {
        next(error);
    }
};

exports.createGoal = (req, res, next) => {
    try {
        const { error } = goalSchema.validate(req.body);
        if (error) {
            const err = new Error(error.details[0].message);
            err.statusCode = 400;
            throw err;
        }

        const userId = req.user.id;
        const goalData = req.body;
        const goals = dbService.read('goals.json');

        const newGoal = {
            ...goalData,
            id: Date.now().toString(),
            userId
        };

        goals.push(newGoal);
        dbService.write('goals.json', goals);
        res.status(201).json(newGoal);
    } catch (error) {
        next(error);
    }
};

exports.updateGoal = (req, res, next) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const goals = getGoalsData();

        const index = goals.findIndex(g => g.id === id && g.userId === userId);
        if (index === -1) {
            const err = new Error('Goal not found');
            err.statusCode = 404;
            throw err;
        }

        const { error } = goalSchema.validate({ ...goals[index], ...req.body });
        if (error) {
            const err = new Error(error.details[0].message);
            err.statusCode = 400;
            throw err;
        }

        goals[index] = { ...goals[index], ...req.body };
        saveGoalsData(goals);
        res.json(goals[index]);
    } catch (error) {
        next(error);
    }
};
