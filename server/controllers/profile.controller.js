const Joi = require('joi');
const dbService = require('../services/db.service');

const profileSchema = Joi.object({
    fullName: Joi.string().min(2).required(),
    tagline: Joi.string().allow(''),
    bio: Joi.string().allow(''),
    roles: Joi.array().items(Joi.string()),
    skills: Joi.array().items(Joi.string()),
    socialLinks: Joi.object().optional()
});

exports.getProfile = (req, res, next) => {
    try {
        const userId = req.user.id;
        const profiles = dbService.read('profiles.json');
        const profile = profiles.find(p => p.userId === userId);

        if (!profile) {
            return res.json({
                userId,
                fullName: 'New User',
                tagline: '',
                bio: '',
                roles: [],
                skills: []
            });
        }

        res.json(profile);
    } catch (error) {
        next(error);
    }
};

exports.updateProfile = (req, res, next) => {
    try {
        const { error } = profileSchema.validate(req.body);
        if (error) {
            const err = new Error(error.details[0].message);
            err.statusCode = 400;
            throw err;
        }

        const userId = req.user.id;
        const profileData = req.body;
        const profiles = dbService.read('profiles.json');

        const index = profiles.findIndex(p => p.userId === userId);
        const updatedProfile = { ...profileData, userId };

        if (index !== -1) {
            profiles[index] = updatedProfile;
        } else {
            profiles.push(updatedProfile);
        }

        dbService.write('profiles.json', profiles);
        res.json(updatedProfile);
    } catch (error) {
        next(error);
    }
};
