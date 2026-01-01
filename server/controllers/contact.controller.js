const fs = require('fs');
const path = require('path');

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

exports.getAllContacts = (req, res) => {
    try {
        const userId = req.user.id;
        const contacts = getContactsData();
        const userContacts = contacts.filter(c => c.userId === userId);
        res.json(userContacts);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving contacts', error: error.message });
    }
};

exports.createContact = (req, res) => {
    try {
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
        res.status(500).json({ message: 'Error creating contact', error: error.message });
    }
};

exports.updateContact = (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const contactData = req.body;
        const contacts = getContactsData();

        const index = contacts.findIndex(c => c.id === id && c.userId === userId);
        if (index === -1) {
            return res.status(404).json({ message: 'Contact not found' });
        }

        contacts[index] = { ...contacts[index], ...contactData };
        saveContactsData(contacts);
        res.json(contacts[index]);
    } catch (error) {
        res.status(500).json({ message: 'Error updating contact', error: error.message });
    }
};

exports.deleteContact = (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const contacts = getContactsData();
        const filtered = contacts.filter(c => !(c.id === id && c.userId === userId));

        if (contacts.length === filtered.length) {
            return res.status(404).json({ message: 'Contact not found' });
        }

        saveContactsData(filtered);
        res.json({ message: 'Contact deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting contact', error: error.message });
    }
};

// Interaction History
exports.addInteraction = (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const interactionData = req.body;
        const contacts = getContactsData();

        const index = contacts.findIndex(c => c.id === id && c.userId === userId);
        if (index === -1) {
            return res.status(404).json({ message: 'Contact not found' });
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
        res.status(500).json({ message: 'Error adding interaction', error: error.message });
    }
};
