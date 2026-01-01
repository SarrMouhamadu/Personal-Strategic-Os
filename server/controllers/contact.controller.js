const dbService = require('../services/db.service');

exports.getAllContacts = (req, res, next) => {
    try {
        const userId = req.user.id;
        const contacts = dbService.read('contacts.json');
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
        const contacts = dbService.read('contacts.json');

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
        dbService.write('contacts.json', contacts);
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

        dbService.write('contacts.json', filtered);
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
        const contacts = dbService.read('contacts.json');

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
