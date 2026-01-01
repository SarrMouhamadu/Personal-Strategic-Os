const Joi = require('joi');
const dbService = require('../services/db.service');

const opportunitySchema = Joi.object({
    title: Joi.string().min(3).required(),
    value: Joi.number().min(0).required(),
    status: Joi.string().valid('DETECTED', 'CONTACTED', 'NEGOTIATION', 'WON', 'LOST').required(),
    contactId: Joi.string().allow(null, '').optional(),
    likelihood: Joi.number().min(0).max(100).required(),
    notes: Joi.string().allow('').optional()
});

exports.getAllOpportunities = (req, res, next) => {
    try {
        const userId = req.user.id;
        const opportunities = dbService.read('opportunities.json');
        const userOpps = opportunities.filter(o => o.userId === userId);
        res.json(userOpps);
    } catch (error) {
        next(error);
    }
};

exports.createOpportunity = (req, res, next) => {
    try {
        const { error } = opportunitySchema.validate(req.body);
        if (error) {
            const err = new Error(error.details[0].message);
            err.statusCode = 400;
            throw err;
        }

        const userId = req.user.id;
        const opportunities = dbService.read('opportunities.json');
        const newOpp = {
            ...req.body,
            id: Date.now().toString(),
            userId,
            createdAt: new Date().toISOString()
        };

        opportunities.push(newOpp);
        dbService.write('opportunities.json', opportunities);
        res.status(201).json(newOpp);
    } catch (error) {
        next(error);
    }
};

exports.updateOpportunity = (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const opportunities = dbService.read('opportunities.json');
        const index = opportunities.findIndex(o => o.id === id && o.userId === userId);

        if (index === -1) {
            const err = new Error('Opportunity not found');
            err.statusCode = 404;
            throw err;
        }

        const { error } = opportunitySchema.validate({ ...opportunities[index], ...req.body });
        if (error) {
            const err = new Error(error.details[0].message);
            err.statusCode = 400;
            throw err;
        }

        opportunities[index] = { ...opportunities[index], ...req.body };
        dbService.write('opportunities.json', opportunities);
        res.json(opportunities[index]);
    } catch (error) {
        next(error);
    }
};

exports.deleteOpportunity = (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const opportunities = dbService.read('opportunities.json');
        const filtered = opportunities.filter(o => !(o.id === id && o.userId === userId));

        if (opportunities.length === filtered.length) {
            const err = new Error('Opportunity not found');
            err.statusCode = 404;
            throw err;
        }

        dbService.write('opportunities.json', filtered);
        res.json({ message: 'Opportunity deleted' });
    } catch (error) {
        next(error);
    }
};
