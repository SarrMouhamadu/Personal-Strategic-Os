const fs = require('fs');
const path = require('path');

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

exports.getProfile = (req, res) => {
    try {
        const userId = req.user.id;
        const profiles = getProfiles();
        const profile = profiles.find(p => p.userId === userId);

        if (!profile) {
            // Return empty structure or default
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
        res.status(500).json({ message: 'Error retrieving profile', error: error.message });
    }
};

exports.updateProfile = (req, res) => {
    try {
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
        res.status(500).json({ message: 'Error updating profile', error: error.message });
    }
};
