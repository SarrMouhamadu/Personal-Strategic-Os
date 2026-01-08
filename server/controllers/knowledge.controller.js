const Joi = require('joi');
const db = require('../models');
const Knowledge = db.knowledge;

const resourceSchema = Joi.object({
    title: Joi.string().min(3).required(),
    type: Joi.string().valid('ARTICLE', 'NOTE', 'BOOK', 'TOOL', 'COURSE').required(),
    summary: Joi.string().required(),
    url: Joi.string().uri().allow(''),
    tags: Joi.array().items(Joi.string()).optional(),
    projectId: Joi.string().allow(null, '').optional(),
    status: Joi.string().valid('TO_PROCESS', 'PROCESSED', 'ARCHIVED').default('TO_PROCESS')
});

exports.getAllResources = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const resources = await Knowledge.findAll({ where: { userId } });
        res.json(resources);
    } catch (error) {
        next(error);
    }
};

exports.createResource = async (req, res, next) => {
    try {
        const { error } = resourceSchema.validate(req.body);
        if (error) {
            const err = new Error(error.details[0].message);
            err.statusCode = 400;
            throw err;
        }

        const userId = req.user.id;
        const newResource = await Knowledge.create({
            ...req.body,
            id: Date.now().toString(),
            userId,
            dateAdded: new Date()
        });

        res.status(201).json(newResource);
    } catch (error) {
        next(error);
    }
};

exports.updateResource = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        
        const resource = await Knowledge.findOne({ where: { id, userId } });
        if (!resource) {
            const err = new Error('Resource not found');
            err.statusCode = 404;
            throw err;
        }

        const { error } = resourceSchema.validate({ ...resource.toJSON(), ...req.body });
        if (error) {
            const err = new Error(error.details[0].message);
            err.statusCode = 400;
            throw err;
        }

        await resource.update(req.body);
        res.json(resource);
    } catch (error) {
        next(error);
    }
};

exports.deleteResource = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        
        const resource = await Knowledge.findOne({ where: { id, userId } });
        if (!resource) {
            const err = new Error('Resource not found');
            err.statusCode = 404;
            throw err;
        }

        await resource.destroy();
        res.json({ message: 'Resource deleted' });
    } catch (error) {
        next(error);
    }
};
