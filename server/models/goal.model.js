module.exports = (sequelize, Sequelize) => {
    const Goal = sequelize.define("goals", {
        id: {
            type: Sequelize.STRING,
            primaryKey: true
        },
        type: {
            type: Sequelize.STRING,
            defaultValue: 'ANNUAL'
        },
        year: {
            type: Sequelize.INTEGER
        },
        quarter: {
            type: Sequelize.INTEGER
        },
        title: {
            type: Sequelize.STRING
        },
        description: {
            type: Sequelize.TEXT
        },
        status: {
            type: Sequelize.STRING,
            defaultValue: 'NOT_STARTED'
        },
        progress: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        keyResults: {
            type: Sequelize.JSON,
            defaultValue: []
        },
        userId: {
            type: Sequelize.STRING
        }
    });

    return Goal;
};
