const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
    database: process.env.DATABASE_NAME,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    dialect: process.env.DB_DIALECT,
    host: process.env.DB_HOST,
});

module.exports = sequelize;
