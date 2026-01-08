module.exports = (sequelize, Sequelize) => {
    const Profile = sequelize.define("profiles", {
        id: {
            type: Sequelize.STRING,
            primaryKey: true
        },
        bio: {
            type: Sequelize.TEXT
        },
        vision: {
            type: Sequelize.TEXT
        },
        values: {
            type: Sequelize.JSON
        },
        skills: {
            type: Sequelize.JSON
        },
        interests: {
            type: Sequelize.JSON
        },
        userId: {
            type: Sequelize.STRING,
            unique: true
        }
    });

    return Profile;
};
