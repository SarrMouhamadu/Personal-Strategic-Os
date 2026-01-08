const Joi = require('joi');
const db = require('../models');
const Project = db.projects;

const projectSchema = Joi.object({
    name: Joi.string().min(2).required(),
    tagline: Joi.string().allow('').optional(),
    description: Joi.string().required(),
    status: Joi.string().valid('IDEATION', 'PLANNING', 'BUILD', 'DEPLOYED', 'GROWTH', 'STABLE', 'ARCHIVED').required(),
    accessLevel: Joi.string().valid('PRIVATE', 'TEAM', 'PUBLIC').default('PRIVATE'),
    logoUrl: Joi.string().uri().allow('').optional(),
    techStack: Joi.array().items(Joi.string()).optional(),
    roadmap: Joi.array().items(Joi.object({
        id: Joi.string().required(),
        title: Joi.string().required(),
        date: Joi.date().optional(),
        completed: Joi.boolean().default(false)
    })).optional(),
    documents: Joi.array().items(Joi.object({
        id: Joi.string().required(),
        name: Joi.string().required(),
        type: Joi.string().valid('PDF', 'LINK', 'G-DOC', 'SHEET', 'SLIDES').required(),
        url: Joi.string().uri().required()
    })).optional(),
    swot: Joi.object({
        strengths: Joi.array().items(Joi.string()).optional(),
        weaknesses: Joi.array().items(Joi.string()).optional(),
        opportunities: Joi.array().items(Joi.string()).optional(),
        threats: Joi.array().items(Joi.string()).optional()
    }).optional(),
    kpis: Joi.array().items(Joi.object({
        id: Joi.string().required(),
        label: Joi.string().required(),
        value: Joi.alternatives().try(Joi.string(), Joi.number()).required(),
        trend: Joi.string().valid('UP', 'DOWN', 'STABLE').optional(),
        status: Joi.string().valid('GOOD', 'WARNING', 'CRITICAL').optional()
    })).optional(),
    impact: Joi.array().items(Joi.object({
        dimension: Joi.string().valid('PERSONAL', 'NETWORK', 'SOCIAL', 'ENVIRONMENTAL').required(),
        score: Joi.number().min(0).max(10).required(),
        description: Joi.string().required(),
        lastMeasured: Joi.string().isoDate().optional()
    })).optional(),
    compliance: Joi.object({
        gdprStatus: Joi.string().valid('COMPLIANT', 'NON_COMPLIANT', 'PENDING_AUDIT').optional(),
        dataCollected: Joi.array().items(Joi.string()).optional(),
        lastAuditDate: Joi.date().optional(),
        dpoContact: Joi.string().optional()
    }).optional(),
    confidentialityLevel: Joi.string().valid('SECRET', 'CONFIDENTIAL').optional(),
    tags: Joi.array().items(Joi.string()).optional()
}).unknown(true);

exports.getProjects = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const projects = await Project.findAll({
            where: {
                [db.Sequelize.Op.or]: [
                    { userId },
                    { accessLevel: 'PUBLIC' }
                ]
            }
        });
        res.json(projects);
    } catch (error) {
        next(error);
    }
};

exports.getProjectById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        
        const project = await Project.findOne({
            where: {
                id,
                [db.Sequelize.Op.or]: [
                    { userId },
                    { accessLevel: 'PUBLIC' }
                ]
            }
        });

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

exports.createProject = async (req, res, next) => {
    try {
        const { error } = projectSchema.validate(req.body);
        if (error) {
            const err = new Error(error.details[0].message);
            err.statusCode = 400;
            throw err;
        }

        const userId = req.user.id;
        const projectData = req.body;

        const newProject = await Project.create({
            ...projectData,
            id: Date.now().toString(),
            userId
        });

        res.status(201).json(newProject);
    } catch (error) {
        next(error);
    }
};

exports.updateProject = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        const project = await Project.findOne({ where: { id, userId } });
        
        if (!project) {
            const err = new Error('Project not found');
            err.statusCode = 404;
            throw err;
        }

        const { error } = projectSchema.validate({ ...project.toJSON(), ...req.body });
        if (error) {
            const err = new Error(error.details[0].message);
            err.statusCode = 400;
            throw err;
        }

        await project.update(req.body);
        res.json(project);
    } catch (error) {
        next(error);
    }
};

exports.archiveProject = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        const project = await Project.findOne({ where: { id, userId } });
        
        if (!project) {
            const err = new Error('Project not found');
            err.statusCode = 404;
            throw err;
        }

        await project.update({ status: 'ARCHIVED' });
        res.json({ message: 'Project archived', project });
    } catch (error) {
        next(error);
    }
};
