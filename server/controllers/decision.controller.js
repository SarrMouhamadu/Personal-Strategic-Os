const fs = require('fs');
const path = require('path');
const Joi = require('joi');

const decisionSchema = Joi.object({
    title: Joi.string().min(3).required(),
    context: Joi.string().required(),
    options: Joi.array().items(Joi.string()).required(),
    outcome: Joi.string().required(),
    impactScore: Joi.number().min(0).max(10).required(),
    date: Joi.string().isoDate().optional(),
    tags: Joi.array().items(Joi.string()).optional()
});

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

exports.getDecisions = (req, res, next) => {
    try {
        const userId = req.user.id;
        const decisions = getDecisionsData();
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
        next(error);
    }
};
