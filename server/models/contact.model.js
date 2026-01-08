module.exports = (sequelize, Sequelize) => {
    const Contact = sequelize.define("contacts", {
        id: {
            type: Sequelize.STRING,
            primaryKey: true
        },
        name: {
            type: Sequelize.STRING
        },
        role: {
            type: Sequelize.STRING
        },
        company: {
            type: Sequelize.STRING
        },
        email: {
            type: Sequelize.STRING
        },
        location: {
            type: Sequelize.STRING
        },
        linkedin: {
            type: Sequelize.STRING
        },
        tags: {
            type: Sequelize.JSON
        },
        interactions: {
            type: Sequelize.JSON
        },
        lastInteraction: {
            type: Sequelize.DATEONLY
        },
        userId: {
            type: Sequelize.STRING
        }
    });

    return Contact;
};
