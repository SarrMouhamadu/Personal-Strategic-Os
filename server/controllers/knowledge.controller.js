const Joi = require('joi');
const dbService = require('../services/db.service');

const resourceSchema = Joi.object({
    title: Joi.string().min(3).required(),
    type: Joi.string().valid('ARTICLE', 'NOTE', 'BOOK', 'TOOL', 'COURSE').required(),
    summary: Joi.string().required(),
    url: Joi.string().uri().allow(''),
    tags: Joi.array().items(Joi.string()).optional(),
    projectId: Joi.string().allow(null, '').optional(),
    status: Joi.string().valid('TO_PROCESS', 'PROCESSED', 'ARCHIVED').default('TO_PROCESS')
});

exports.getAllResources = (req, res, next) => {
    try {
        const userId = req.user.id;
        const resources = dbService.read('knowledge.json');
        const userResources = resources.filter(r => r.userId === userId);
        res.json(userResources);
    } catch (error) {
        next(error);
    }
};

exports.createResource = (req, res, next) => {
    try {
        const { error } = resourceSchema.validate(req.body);
        if (error) {
            const err = new Error(error.details[0].message);
            err.statusCode = 400;
            throw err;
        }

        const userId = req.user.id;
        const resources = dbService.read('knowledge.json');
        const newResource = {
            ...req.body,
            id: Date.now().toString(),
            userId,
            dateAdded: new Date().toISOString()
        };

        resources.push(newResource);
        dbService.write('knowledge.json', resources);
        res.status(201).json(newResource);
    } catch (error) {
        next(error);
    }
};

exports.updateResource = (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const resources = dbService.read('knowledge.json');
        const index = resources.findIndex(r => r.id === id && r.userId === userId);

        if (index === -1) {
            const err = new Error('Resource not found');
            err.statusCode = 404;
            throw err;
        }

        const { error } = resourceSchema.validate({ ...resources[index], ...req.body });
        if (error) {
            const err = new Error(error.details[0].message);
            err.statusCode = 400;
            throw err;
        }

        resources[index] = { ...resources[index], ...req.body };
        dbService.write('knowledge.json', resources);
        res.json(resources[index]);
    } catch (error) {
        next(error);
    }
};

exports.deleteResource = (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const resources = dbService.read('knowledge.json');
        const filtered = resources.filter(r => !(r.id === id && r.userId === userId));

        if (resources.length === filtered.length) {
            const err = new Error('Resource not found');
            err.statusCode = 404;
            throw err;
        }

        dbService.write('knowledge.json', filtered);
        res.json({ message: 'Resource deleted' });
    } catch (error) {
        next(error);
    }
};
