const fs = require('fs');
const path = require('path');
const Joi = require('joi');

const profileSchema = Joi.object({
    fullName: Joi.string().min(2).required(),
    tagline: Joi.string().allow(''),
    bio: Joi.string().allow(''),
    roles: Joi.array().items(Joi.string()),
    skills: Joi.array().items(Joi.string()),
    socialLinks: Joi.object().optional()
});

const profilesFilePath = path.join(__dirname, '../data/profiles.json');

const getProfiles = () => {
    try {
        const data = fs.readFileSync(profilesFilePath, 'utf8');
        return JSON.parse(data);
    } catch (e) {
        return [];
    }
};

const saveProfiles = (profiles) => {
    fs.writeFileSync(profilesFilePath, JSON.stringify(profiles, null, 2));
};

exports.getProfile = (req, res, next) => {
    try {
        const userId = req.user.id;
        const profiles = getProfiles();
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
        const profiles = getProfiles();

        const index = profiles.findIndex(p => p.userId === userId);
        const updatedProfile = { ...profileData, userId };

        if (index !== -1) {
            profiles[index] = updatedProfile;
        } else {
            profiles.push(updatedProfile);
        }

        saveProfiles(profiles);
        res.json(updatedProfile);
    } catch (error) {
        next(error);
    }
};
