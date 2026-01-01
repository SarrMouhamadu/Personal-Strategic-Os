const Joi = require('joi');
const dbService = require('../services/db.service');

const projectSchema = Joi.object({
    name: Joi.string().min(2).required(),
    tagline: Joi.string().allow('').optional(),
    description: Joi.string().required(),
    status: Joi.string().valid('IDEATION', 'PLANNING', 'BUILD', 'DEPLOYED', 'GROWTH', 'STABLE', 'ARCHIVED').required(),
    accessLevel: Joi.string().valid('PRIVATE', 'TEAM', 'PUBLIC').default('PRIVATE'),
    techStack: Joi.array().items(Joi.string()).optional(),
    confidentialityLevel: Joi.string().valid('SECRET', 'CONFIDENTIAL').optional(),
    tags: Joi.array().items(Joi.string()).optional(),
    impact: Joi.array().items(Joi.object({
        dimension: Joi.string().valid('PERSONAL', 'NETWORK', 'SOCIAL', 'ENVIRONMENTAL').required(),
        score: Joi.number().min(0).max(10).required(),
        description: Joi.string().required(),
        lastMeasured: Joi.string().isoDate().optional()
    })).optional()
}).unknown(true); // Allow unknown keys to avoid strict failure during migration

exports.getProjects = (req, res, next) => {
    try {
        const userId = req.user.id;
        const projects = dbService.read('projects.json');
        const userProjects = projects.filter(p => p.userId === userId || p.accessLevel === 'PUBLIC');
        res.json(userProjects);
    } catch (error) {
        next(error);
    }
};

exports.getProjectById = (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const projects = dbService.read('projects.json');
        const project = projects.find(p => p.id === id && (p.userId === userId || p.accessLevel === 'PUBLIC'));

        if (!project) {
            const err = new Error('Project not found');
            err.statusCode = 404;
            throw err;
        }
        res.json(project);
    } catch (error) {
        next(error);
    }
};

exports.createProject = (req, res, next) => {
    try {
        const { error } = projectSchema.validate(req.body);
        if (error) {
            const err = new Error(error.details[0].message);
            err.statusCode = 400;
            throw err;
        }

        const userId = req.user.id;
        const projectData = req.body;
        const projects = dbService.read('projects.json');

        const newProject = {
            ...projectData,
            id: Date.now().toString(),
            userId,
            createdAt: new Date().toISOString()
        };

        projects.push(newProject);
        dbService.write('projects.json', projects);
        res.status(201).json(newProject);
    } catch (error) {
        next(error);
    }
};

exports.updateProject = (req, res, next) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const projects = dbService.read('projects.json');

        const index = projects.findIndex(p => p.id === id && p.userId === userId);
        if (index === -1) {
            const err = new Error('Project not found');
            err.statusCode = 404;
            throw err;
        }

        const { error } = projectSchema.validate({ ...projects[index], ...req.body });
        if (error) {
            const err = new Error(error.details[0].message);
            err.statusCode = 400;
            throw err;
        }

        projects[index] = { ...projects[index], ...req.body };
        dbService.write('projects.json', projects);
        res.json(projects[index]);
    } catch (error) {
        next(error);
    }
};

exports.archiveProject = (req, res, next) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const projects = dbService.read('projects.json');

        const index = projects.findIndex(p => p.id === id && p.userId === userId);
        if (index === -1) {
            const err = new Error('Project not found');
            err.statusCode = 404;
            throw err;
        }

        projects[index].status = 'ARCHIVED';
        dbService.write('projects.json', projects);
        res.json({ message: 'Project archived', project: projects[index] });
    } catch (error) {
        next(error);
    }
};
