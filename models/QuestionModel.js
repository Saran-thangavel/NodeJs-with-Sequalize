const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Your Sequelize instance

const Question = sequelize.define('quiz_questions', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  desc: {
    type: DataTypes.STRING,
  },
});

module.exports = Question;
