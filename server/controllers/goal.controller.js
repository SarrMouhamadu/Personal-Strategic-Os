const dbService = require('../services/db.service');

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
        const goals = getGoalsData();

        const newGoal = {
            ...goalData,
            id: Date.now().toString(),
            userId
        };

        goals.push(newGoal);
        saveGoalsData(goals);
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
