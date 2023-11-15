const { DataTypes } = require("sequelize");
const sequelize = require('../config/database'); // Your Sequelize instance

const Scorecard = sequelize.define("score_card", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
    },
    score: {
        type: DataTypes.INTEGER,
    },
});

module.exports = Scorecard;
