const questionModal = require("../models/QuestionModel");
const optionModal = require("../models/OptionModel");
const getTokenInfo = require("../utils/tokenInfo");
const answersModal = require("../models/UserAnswer");

const getUserScore = async (req, res) => {
    var result;
    try {
        const response = getTokenInfo(req, res);
        const userId = response.userId;
        console.log(userId);
        const questions = await questionModal.findAll();

        if (!questions) {
            return res.status(400).json({ message: "No questions found." });
        }

        const answers = await answersModal.findAll({ where: { user_id: userId } });
        let score = 0;
        answers.forEach((data) => {
            const question = optionModal.findAll({ where: { question_id: data.ques_id } });
            console.log("inside");
            if (question) {
                const correctAnswerId = question.correct_answer;
                if (data.chosen_answer === correctAnswerId) {
                    return score++;
                }
            }
            console.log(score, "score");

            const answeredQuestionsData = unAnsweredQuestions(questions, answers);

            console.log(unAnsweredQuestions, "amswer");
            result = {
                score: `${score}/${questions.length}`,
                unAnsweredQuestionCount: questions.length - answeredQuestionsData,
            };
        });
        return res.status(200).json({ message: result });
    } catch (error) {
        return res.status(500).json({ message: error });
    }
};

const unAnsweredQuestions = (questions, answers) => {
    var answeredQuestions = 0;
    questions.filter(async (question) => {
        answeredQuestions = await answers.find((ua) => {
            if (ua.ques_id === question.id) {
                answeredQuestions++;
            }
        });
    });
    return answeredQuestions;
};

module.exports = { getUserScore };
