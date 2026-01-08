const Joi = require('joi');
const db = require('../models');
const Contact = db.contacts;

const contactSchema = Joi.object({
    name: Joi.string().min(2).required(),
    role: Joi.string().required(),
    company: Joi.string().required(),
    email: Joi.string().email().required(),
    location: Joi.string().required(),
    linkedin: Joi.string().uri().allow(''),
    tags: Joi.array().items(Joi.string()),
    interactions: Joi.array().items(Joi.object()).optional()
}).unknown(true);

const interactionSchema = Joi.object({
    type: Joi.string().valid('EMAIL', 'CALL', 'MEETING', 'LUNCH', 'OTHER').required(),
    date: Joi.string().isoDate().required(),
    summary: Joi.string().required()
});

exports.getAllContacts = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const contacts = await Contact.findAll({ where: { userId } });
        res.json(contacts);
    } catch (error) {
        next(error);
    }
};

exports.createContact = async (req, res, next) => {
    try {
        const { error } = contactSchema.validate(req.body);
        if (error) {
            const err = new Error(error.details[0].message);
            err.statusCode = 400;
            throw err;
        }

        const userId = req.user.id;
        const contactData = req.body;

        const newContact = await Contact.create({
            ...contactData,
            id: Date.now().toString(),
            userId,
            interactions: contactData.interactions || []
        });

        res.status(201).json(newContact);
    } catch (error) {
        next(error);
    }
};

exports.updateContact = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        const contact = await Contact.findOne({ where: { id, userId } });
        if (!contact) {
            const err = new Error('Contact not found');
            err.statusCode = 404;
            throw err;
        }

        const { error } = contactSchema.validate({ ...contact.toJSON(), ...req.body });
        if (error) {
            const err = new Error(error.details[0].message);
            err.statusCode = 400;
            throw err;
        }

        await contact.update(req.body);
        res.json(contact);
    } catch (error) {
        next(error);
    }
};

exports.deleteContact = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        
        const contact = await Contact.findOne({ where: { userId } });
        if (!contact) {
            const err = new Error('Contact not found');
            err.statusCode = 404;
            throw err;
        }

        await contact.destroy();
        res.json({ message: 'Contact deleted' });
    } catch (error) {
        next(error);
    }
};

// Interaction History
exports.addInteraction = async (req, res, next) => {
    try {
        const { error } = interactionSchema.validate(req.body);
        if (error) {
            const err = new Error(error.details[0].message);
            err.statusCode = 400;
            throw err;
        }

        const userId = req.user.id;
        const { id } = req.params;
        const interactionData = req.body;

        const contact = await Contact.findOne({ where: { id, userId } });
        if (!contact) {
            const err = new Error('Contact not found');
            err.statusCode = 404;
            throw err;
        }

        const newInteraction = {
            ...interactionData,
            id: Date.now().toString()
        };

        const interactions = contact.interactions || [];
        interactions.push(newInteraction);
        
        await contact.update({ 
            interactions,
            lastInteraction: newInteraction.date
        });

        res.status(201).json(newInteraction);
    } catch (error) {
        next(error);
    }
};
