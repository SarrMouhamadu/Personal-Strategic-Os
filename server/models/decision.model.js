module.exports = (sequelize, Sequelize) => {
    const Decision = sequelize.define("decisions", {
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
        options: {
            type: Sequelize.JSON
        },
        selectedOption: {
            type: Sequelize.STRING
        },
        status: {
            type: Sequelize.STRING,
            defaultValue: 'PENDING'
        },
        deadline: {
            type: Sequelize.DATEONLY
        },
        userId: {
            type: Sequelize.STRING
        }
    });

    return Decision;
};
