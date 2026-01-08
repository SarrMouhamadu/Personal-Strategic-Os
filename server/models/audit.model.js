module.exports = (sequelize, Sequelize) => {
    const Audit = sequelize.define("audit_logs", {
        id: {
            type: Sequelize.STRING,
            primaryKey: true
        },
        action: {
            type: Sequelize.STRING
        },
        entityType: {
            type: Sequelize.STRING
        },
        entityId: {
            type: Sequelize.STRING
        },
        details: {
            type: Sequelize.JSON
        },
        userId: {
            type: Sequelize.STRING
        },
        timestamp: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        }
    });

    return Audit;
};
