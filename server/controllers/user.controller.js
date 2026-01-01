const fs = require('fs');
const path = require('path');

const usersFilePath = path.join(__dirname, '../data/users.json');

const getUsers = () => {
    const data = fs.readFileSync(usersFilePath, 'utf8');
    return JSON.parse(data);
};

const saveUsers = (users) => {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
};

exports.updateRole = (req, res) => {
    try {
        const { role } = req.body;
        const userId = req.user.id; // From auth middleware

        if (!['PRIVATE', 'PUBLIC', 'INVESTOR'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role' });
        }

        const users = getUsers();
        const userIndex = users.findIndex(u => u.id === userId);

        if (userIndex === -1) {
            return res.status(404).json({ message: 'User not found' });
        }

        users[userIndex].role = role;
        saveUsers(users);

        res.json({ message: 'Role updated successfully', role });
    } catch (error) {
        res.status(500).json({ message: 'Error updating role', error: error.message });
    }
};
