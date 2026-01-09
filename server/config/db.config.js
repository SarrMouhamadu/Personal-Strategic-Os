const Sequelize = require('sequelize');
require('dotenv').config();

const dbName = process.env.DB_NAME || 'personal_strategic_os';
const dbUser = process.env.DB_USER || 'root';
const dbPassword = process.env.DB_PASSWORD || '';
const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = process.env.DB_PORT || 3306;

const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
    host: dbHost,
    port: dbPort,
    dialect: 'mysql',
    logging: false,
    pool: {
        max: 15,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

module.exports = sequelize;
