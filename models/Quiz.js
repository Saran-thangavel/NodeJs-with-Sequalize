const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const UserAnswer = require("./UserAnswer");

const QuizUser = sequelize.define("user", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
    },
    email: {
        type: DataTypes.STRING,
    },
});

module.exports = QuizUser;
