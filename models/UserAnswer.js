const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Your Sequelize instance
const QuizUser = require('./User');

const UserAnswer = sequelize.define('user_answer', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
  },
  ques_id: {
    type: DataTypes.INTEGER,
  },
  chosen_answer: {
    type: DataTypes.INTEGER,
  },
});



module.exports = UserAnswer;
