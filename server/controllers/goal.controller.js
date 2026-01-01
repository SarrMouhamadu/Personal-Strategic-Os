const fs = require('fs');
const path = require('path');

const goalsFilePath = path.join(__dirname, '../data/goals.json');

const getGoalsData = () => {
    try {
        const data = fs.readFileSync(goalsFilePath, 'utf8');
        return JSON.parse(data);
    } catch (e) {
        return [];
    }
};

const saveGoalsData = (goals) => {
    fs.writeFileSync(goalsFilePath, JSON.stringify(goals, null, 2));
};

exports.getGoals = (req, res) => {
    try {
        const userId = req.user.id;
        const year = parseInt(req.query.year) || new Date().getFullYear();
        const goals = getGoalsData();
        const userGoals = goals.filter(g => g.userId === userId && g.year === year);
        res.json(userGoals);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving goals', error: error.message });
    }
};

exports.createGoal = (req, res) => {
    try {
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
        res.status(500).json({ message: 'Error creating goal', error: error.message });
    }
};

exports.updateGoal = (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const goalData = req.body;
        const goals = getGoalsData();

        const index = goals.findIndex(g => g.id === id && g.userId === userId);
        if (index === -1) {
            return res.status(404).json({ message: 'Goal not found' });
        }

        goals[index] = { ...goals[index], ...goalData };
        saveGoalsData(goals);
        res.json(goals[index]);
    } catch (error) {
        res.status(500).json({ message: 'Error updating goal', error: error.message });
    }
};
