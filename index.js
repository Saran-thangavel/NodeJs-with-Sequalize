const express = require("express");
require("dotenv").config();
const app = express();
const sequelize = require("./config/database");
const baseRouter = require("./routes/baseRoutes");
const Option = require("./models/OptionModel");
const Question = require("./models/QuestionModel");
const Quiz = require("./models/User");
const scoreModel = require("./models/ScorecardModel");
const answers = require("./models/UserAnswer");
const QuizUser = require("./models/User");
const UserAnswer = require("./models/UserAnswer");
const Scorecard = require("./models/ScorecardModel");

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json
app.use(express.json());

app.use("/user", baseRouter);

const databaseConnection = async () => {
    try {
        await sequelize.sync({ alter: true });
        console.log("Connection has been established successfully.");
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
};

databaseConnection();

QuizUser.hasMany(UserAnswer, { foreignKey: "user_id" });
UserAnswer.belongsTo(QuizUser, { foreignKey: "user_id" });
Question.hasMany(UserAnswer, { foreignKey: "ques_id" });
UserAnswer.belongsTo(Question, { foreignKey: "ques_id" });
Option.hasMany(UserAnswer, { foreignKey: "ques_id" });
UserAnswer.hasMany(Option, { foreignKey: "ques_id" });
QuizUser.hasOne(Scorecard, { foreignKey: "user_id" });
Scorecard.belongsTo(QuizUser, { foreignKey: "user_id" });

app.use((req, res) => {
    res.status(404).send("Not Found");
});

app.use((req, res) => {
    res.status(401).send("Unauthorized");
});

app.use((req, res) => {
    res.status(403).send("Forbidden");
});

app.use((req, res) => {
    res.status(405).send("Method not allowed");
});

app.use((req, res) => {
    res.status(408).send("Request time-out");
});

app.listen(8081, () => {
    console.log("Server is running on port 8081");
});
