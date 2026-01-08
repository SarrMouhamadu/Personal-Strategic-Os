const Joi = require('joi');
const db = require('../models');
const Opportunity = db.opportunities;

const opportunitySchema = Joi.object({
    title: Joi.string().min(3).required(),
    value: Joi.number().min(0).required(),
    status: Joi.string().valid('DETECTED', 'CONTACTED', 'NEGOTIATION', 'WON', 'LOST').required(),
    contactId: Joi.string().allow(null, '').optional(),
    likelihood: Joi.number().min(0).max(100).required(),
    notes: Joi.string().allow('').optional()
});

exports.getAllOpportunities = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const opportunities = await Opportunity.findAll({ where: { userId } });
        res.json(opportunities);
    } catch (error) {
        next(error);
    }
};

exports.createOpportunity = async (req, res, next) => {
    try {
        const { error } = opportunitySchema.validate(req.body);
        if (error) {
            const err = new Error(error.details[0].message);
            err.statusCode = 400;
            throw err;
        }

        const userId = req.user.id;
        const newOpp = await Opportunity.create({
            ...req.body,
            id: Date.now().toString(),
            userId
        });

        res.status(201).json(newOpp);
    } catch (error) {
        next(error);
    }
};

exports.updateOpportunity = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        
        const opportunity = await Opportunity.findOne({ where: { id, userId } });
        if (!opportunity) {
            const err = new Error('Opportunity not found');
            err.statusCode = 404;
            throw err;
        }

        const { error } = opportunitySchema.validate({ ...opportunity.toJSON(), ...req.body });
        if (error) {
            const err = new Error(error.details[0].message);
            err.statusCode = 400;
            throw err;
        }

        await opportunity.update(req.body);
        res.json(opportunity);
    } catch (error) {
        next(error);
    }
};

exports.deleteOpportunity = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        
        const opportunity = await Opportunity.findOne({ where: { id, userId } });
        if (!opportunity) {
            const err = new Error('Opportunity not found');
            err.statusCode = 404;
            throw err;
        }

        await opportunity.destroy();
        res.json({ message: 'Opportunity deleted' });
    } catch (error) {
        next(error);
    }
};
