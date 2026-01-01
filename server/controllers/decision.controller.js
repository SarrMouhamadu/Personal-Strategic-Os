const fs = require('fs');
const path = require('path');

const decisionsFilePath = path.join(__dirname, '../data/decisions.json');

const getDecisionsData = () => {
    try {
        const data = fs.readFileSync(decisionsFilePath, 'utf8');
        return JSON.parse(data);
    } catch (e) {
        return [];
    }
};

const saveDecisionsData = (decisions) => {
    fs.writeFileSync(decisionsFilePath, JSON.stringify(decisions, null, 2));
};

exports.getDecisions = (req, res) => {
    try {
        const userId = req.user.id;
        const decisions = getDecisionsData();
        const userDecisions = decisions.filter(d => d.userId === userId);
        res.json(userDecisions);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving decisions', error: error.message });
    }
};

exports.createDecision = (req, res) => {
    try {
        const userId = req.user.id;
        const decisionData = req.body;
        const decisions = getDecisionsData();

        const newDecision = {
            ...decisionData,
            id: Date.now().toString(),
            userId,
            date: decisionData.date || new Date().toISOString()
        };

        decisions.push(newDecision);
        saveDecisionsData(decisions);
        res.status(201).json(newDecision);
    } catch (error) {
        res.status(500).json({ message: 'Error creating decision', error: error.message });
    }
};
