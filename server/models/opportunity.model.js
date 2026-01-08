module.exports = (sequelize, Sequelize) => {
    const Opportunity = sequelize.define("opportunities", {
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
        source: {
            type: Sequelize.STRING
        },
        status: {
            type: Sequelize.STRING,
            defaultValue: 'NEW'
        },
        priority: {
            type: Sequelize.STRING
        },
        estimatedValue: {
            type: Sequelize.DECIMAL(10, 2)
        },
        deadline: {
            type: Sequelize.DATEONLY
        },
        userId: {
            type: Sequelize.STRING
        }
    });

    return Opportunity;
};
