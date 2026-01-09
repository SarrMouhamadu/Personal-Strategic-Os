const Joi = require('joi');
const db = require('../models');
const Profile = db.profiles;

const profileSchema = Joi.object({
    fullName: Joi.string().min(2).required(),
    tagline: Joi.string().allow(''),
    bio: Joi.string().allow(''),
    roles: Joi.array().items(Joi.any()),
    skills: Joi.array().items(Joi.any()),
    socialLinks: Joi.object().optional()
});

exports.getProfile = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const profile = await Profile.findOne({ where: { userId } });

        if (!profile) {
            // Get the user's name from the User model
            const user = await db.users.findByPk(userId);
            return res.json({
                userId,
                fullName: user ? user.name : 'New User',
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

exports.updateProfile = async (req, res, next) => {
    try {
        const { error } = profileSchema.validate(req.body);
        if (error) {
            const err = new Error(error.details[0].message);
            err.statusCode = 400;
            throw err;
        }

        const userId = req.user.id;
        const profileData = req.body;

        let profile = await Profile.findOne({ where: { userId } });
        
        if (profile) {
            await profile.update(profileData);
        } else {
            profile = await Profile.create({
                ...profileData,
                id: Date.now().toString(),
                userId
            });
        }

        res.json(profile);
    } catch (error) {
        next(error);
    }
};

exports.uploadAvatar = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Aucun fichier n\'a été téléchargé' });
        }

        const userId = req.user.id;
        const avatarUrl = `/uploads/avatars/${req.file.filename}`;

        let profile = await Profile.findOne({ where: { userId } });
        if (profile) {
            await profile.update({ avatarUrl });
        } else {
            profile = await Profile.create({
                id: Date.now().toString(),
                userId,
                fullName: req.user.name || 'New User',
                avatarUrl,
                roles: [],
                skills: []
            });
        }

        res.json({ avatarUrl, profile });
    } catch (error) {
        next(error);
    }
};
