module.exports = (sequelize, Sequelize) => {
    const Scenario = sequelize.define("scenarios", {
        id: {
            type: Sequelize.STRING,
            primaryKey: true
        },
        title: {
            type: Sequelize.STRING
        },
        description: {
            type: Sequelize.TEXT
        },
        assumptions: {
            type: Sequelize.JSON
        },
        outcomes: {
            type: Sequelize.JSON
        },
        probability: {
            type: Sequelize.DECIMAL(5, 2)
        },
        userId: {
            type: Sequelize.STRING
        }
    });

    return Scenario;
};
