const db = require('../models');
const User = db.users;

exports.updateRole = async (req, res) => {
    try {
        const { role } = req.body;
        const userId = req.user.id; // From auth middleware

        if (!['PRIVATE', 'PUBLIC', 'INVESTOR'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role' });
        }

        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.role = role;
        await user.save();

        res.json({ message: 'Role updated successfully', role });
    } catch (error) {
        res.status(500).json({ message: 'Error updating role', error: error.message });
    }
};
