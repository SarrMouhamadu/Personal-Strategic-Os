module.exports = (sequelize, Sequelize) => {
    const Knowledge = sequelize.define("knowledge", {
        id: {
            type: Sequelize.STRING,
            primaryKey: true
        },
        title: {
            type: Sequelize.STRING
        },
        type: {
            type: Sequelize.STRING
        },
        summary: {
            type: Sequelize.TEXT
        },
        url: {
            type: Sequelize.STRING
        },
        tags: {
            type: Sequelize.JSON
        },
        projectId: {
            type: Sequelize.STRING
        },
        status: {
            type: Sequelize.STRING,
            defaultValue: 'TO_PROCESS'
        },
        dateAdded: {
            type: Sequelize.DATE
        },
        userId: {
            type: Sequelize.STRING
        }
    });

    return Knowledge;
};
