module.exports = (sequelize, Sequelize) => {
    const Expense = sequelize.define("expenses", {
        id: {
            type: Sequelize.STRING,
            primaryKey: true
        },
        userId: {
            type: Sequelize.STRING,
            allowNull: false
        },
        description: {
            type: Sequelize.STRING,
            allowNull: false
        },
        amount: {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: false
        },
        category: {
            type: Sequelize.ENUM('FIXED', 'VARIABLE', 'EXCEPTIONAL'),
            defaultValue: 'VARIABLE'
        },
        frequency: {
            type: Sequelize.ENUM('MONTHLY', 'QUARTERLY', 'ANNUAL', 'PUNCTUAL'),
            defaultValue: 'PUNCTUAL'
        },
        isPlanned: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        receiptUrl: {
            type: Sequelize.STRING,
            allowNull: true
        },
        date: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        }
    });

    return Expense;
};
