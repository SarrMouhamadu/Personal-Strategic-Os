const fs = require('fs');
const path = require('path');
const Joi = require('joi');

const contactSchema = Joi.object({
    name: Joi.string().min(2).required(),
    role: Joi.string().required(),
    company: Joi.string().required(),
    email: Joi.string().email().required(),
    location: Joi.string().required(),
    linkedin: Joi.string().uri().allow(''),
    tags: Joi.array().items(Joi.string()),
    interactions: Joi.array().items(Joi.object()).optional()
});

const interactionSchema = Joi.object({
    type: Joi.string().valid('EMAIL', 'CALL', 'MEETING', 'LUNCH', 'OTHER').required(),
    date: Joi.string().isoDate().required(),
    summary: Joi.string().required()
});

const contactsFilePath = path.join(__dirname, '../data/contacts.json');

const getContactsData = () => {
    try {
        const data = fs.readFileSync(contactsFilePath, 'utf8');
        return JSON.parse(data);
    } catch (e) {
        return [];
    }
};

const saveContactsData = (contacts) => {
    fs.writeFileSync(contactsFilePath, JSON.stringify(contacts, null, 2));
};

exports.getAllContacts = (req, res, next) => {
    try {
        const userId = req.user.id;
        const contacts = getContactsData();
        const userContacts = contacts.filter(c => c.userId === userId);
        res.json(userContacts);
    } catch (error) {
        next(error);
    }
};

exports.createContact = (req, res, next) => {
    try {
        const { error } = contactSchema.validate(req.body);
        if (error) {
            const err = new Error(error.details[0].message);
            err.statusCode = 400;
            throw err;
        }

        const userId = req.user.id;
        const contactData = req.body;
        const contacts = getContactsData();

        const newContact = {
            ...contactData,
            id: Date.now().toString(),
            userId,
            interactions: contactData.interactions || [],
            createdAt: new Date().toISOString()
        };

        contacts.push(newContact);
        saveContactsData(contacts);
        res.status(201).json(newContact);
    } catch (error) {
        next(error);
    }
};

exports.updateContact = (req, res, next) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const contacts = getContactsData();

        const index = contacts.findIndex(c => c.id === id && c.userId === userId);
        if (index === -1) {
            const err = new Error('Contact not found');
            err.statusCode = 404;
            throw err;
        }

        const { error } = contactSchema.validate({ ...contacts[index], ...req.body });
        if (error) {
            const err = new Error(error.details[0].message);
            err.statusCode = 400;
            throw err;
        }

        contacts[index] = { ...contacts[index], ...req.body };
        saveContactsData(contacts);
        res.json(contacts[index]);
    } catch (error) {
        next(error);
    }
};

exports.deleteContact = (req, res, next) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const contacts = getContactsData();
        const filtered = contacts.filter(c => !(c.id === id && c.userId === userId));

        if (contacts.length === filtered.length) {
            const err = new Error('Contact not found');
            err.statusCode = 404;
            throw err;
        }

        saveContactsData(filtered);
        res.json({ message: 'Contact deleted' });
    } catch (error) {
        next(error);
    }
};

// Interaction History
exports.addInteraction = (req, res, next) => {
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
        const contacts = getContactsData();

        const index = contacts.findIndex(c => c.id === id && c.userId === userId);
        if (index === -1) {
            const err = new Error('Contact not found');
            err.statusCode = 404;
            throw err;
        }

        const newInteraction = {
            ...interactionData,
            id: Date.now().toString()
        };

        contacts[index].interactions.push(newInteraction);
        contacts[index].lastInteraction = newInteraction.date;

        saveContactsData(contacts);
        res.status(201).json(newInteraction);
    } catch (error) {
        next(error);
    }
};
