const fs = require('fs');
const path = require('path');
const db = require('../models');

const migrateData = async () => {
    try {
        await db.sequelize.sync({ alter: true });
        console.log('Database synced.');

        // Migrate Users
        const usersPath = path.join(__dirname, '../data/users.json');
        if (fs.existsSync(usersPath)) {
            const usersData = JSON.parse(fs.readFileSync(usersPath, 'utf8'));
            if (usersData.length > 0) {
                console.log(`Migrating ${usersData.length} users...`);
                await db.users.bulkCreate(usersData, { ignoreDuplicates: true });
                console.log('Users migrated.');
            }
        }

        // Migrate Projects
        const projectsPath = path.join(__dirname, '../data/projects.json');
        if (fs.existsSync(projectsPath)) {
            const projectsData = JSON.parse(fs.readFileSync(projectsPath, 'utf8'));
            if (projectsData.length > 0) {
                console.log(`Migrating ${projectsData.length} projects...`);
                // Ensure techStack is properly formatted if needed, but Sequelize handles JSON
                await db.projects.bulkCreate(projectsData, { ignoreDuplicates: true });
                console.log('Projects migrated.');
            }
        }

        console.log('Migration completed successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
};

migrateData();
