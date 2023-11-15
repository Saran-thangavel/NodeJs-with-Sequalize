const { DataTypes } = require("sequelize");
const sequelize = require("../config/database"); // Your Sequelize instance

const Option = sequelize.define("quiz_options", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    question_id: {
        type: DataTypes.INTEGER,
    },
    choice: {
        type: DataTypes.STRING,
    },
    correct_answer: {
        type: DataTypes.BOOLEAN,
    },
});

module.exports = Option;
