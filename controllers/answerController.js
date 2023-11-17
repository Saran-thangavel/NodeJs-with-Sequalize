const questionModal = require("../models/QuestionModel");
const optionModal = require("../models/OptionModel");
const getTokenInfo = require("../utils/tokenInfo");
const userInfoModal = require("../models/User");
const answersModal = require("../models/UserAnswer");

const answerAQuestion = async (req, res) => {
    const { ques_id, chosen_answer } = req.body;

    if (!ques_id || !chosen_answer) {
        return res.status(400).json({ message: "Required fields cannot be empty" });
    }

    try {
        const response = getTokenInfo(req, res);
        const userInfo = await userInfoModal.findOne({ where: { email: response.email } });
        const question = await questionModal.findOne({ where: { id: ques_id } });
        if (!question) {
            return res.status(404).json({ message: "Question not found" });
        }

        const existingAnswer = await answersModal.findOne({ where: { user_id: response.userId, ques_id: ques_id } });

        if (existingAnswer) {
            return res.status(400).json({ message: "You have already answered this question" });
        }

        // Check if the chosen_answer is a valid option for the question
        const option = await optionModal.findOne({
            where: { question_id: ques_id, id: chosen_answer },
        });
        if (!option) {
            return res.status(400).json({ message: "Chosen answer is not a valid option for the question" });
        }
        if (chosen_answer !== option.id) {
            return res.status(400).json({ message: "Not a valid option id" });
        }

        await answersModal.create({
            user_id: response.userId,
            ques_id: ques_id,
            chosen_answer: chosen_answer,
        });
        res.status(201).json({ message: `Dear ${userInfo.firstname} ${userInfo.lastname}, your answer has been successfully submitted` });
    } catch (error) {
        return res.status(500).json({ message: error });
    }
};

const answerAllQuestions = async (req, res) => {
    const answers = req.body;

    if (!answers || !Array.isArray(answers) || answers.length === 0) {
        return res.status(400).json({ message: "Required fields cannot be empty" });
    }

    try {
        const response = getTokenInfo(req, res);
        const userInfo = await userInfoModal.findOne({ where: { email: response.email } });

        const questionIds = answers.map((answer) => {
            return answer.ques_id;
        });

        const questions = await questionModal.findAll({ where: { id: questionIds } });
        if (questions.length !== questionIds.length) {
            return res.status(400).json({ message: "One or more questions not found." });
        }

        const existingAnswers = await answersModal.findAll({ where: { user_id: response.userId, ques_id: questionIds } });
        if (existingAnswers.length > 0) {
            return res.status(400).json({ message: "You have already answered one or more questions." });
        }

        const answersData = answers.map((answer) => {
            return { user_id: response.userId, ques_id: answer.ques_id, chosen_answer: answer.chosen_answer };
        });

        await answersModal.bulkCreate(answersData);
        res.status(200).json({ message: `Dear ${userInfo.firstname} ${userInfo.lastname}, your answers have been successfully submitted` });
    } catch (error) {
        return res.status(500).json({ message: error });
    }
};

const updateAnswers = async (req, res) => {
    const answers = req.body;

    if (!answers || !Array.isArray(answers) || answers.length === 0) {
        return res.status(400).json({ message: "Required fields cannot be empty" });
    }

    try {
        const response = getTokenInfo(req, res);
        const userInfo = await userInfoModal.findOne({ where: { email: response.email } });

        const questionIds = answers.map((answer) => {
            return answer.ques_id;
        });

        const questions = await questionModal.findAll({ where: { id: questionIds } });
        if (questions.length !== questionIds.length) {
            return res.status(400).json({ message: "One or more questions not found." });
        }

        const existingAnswers = await answersModal.findAll({ where: { user_id: response.userId, ques_id: questionIds } });
        if (existingAnswers.length > 0) {
            // Use update method to update existing records
            for (const answer of answers) {
                await answersModal.update({ chosen_answer: answer.chosen_answer }, { where: { user_id: response.userId, ques_id: answer.ques_id } });
            }
            return res.status(200).json({ message: `Dear ${userInfo.firstname} ${userInfo.lastname}, your answers have been successfully updated` });
        }

        await answersModal.bulkCreate(
            answers.map((answer) => ({
                user_id: response.userId,
                ques_id: answer.ques_id,
                chosen_answer: answer.chosen_answer,
            }))
        );

        res.status(200).json({ message: `Dear ${userInfo.firstname} ${userInfo.lastname}, your answers have been successfully submitted` });
    } catch (error) {
        return res.status(500).json({ message: error });
    }
};

module.exports = { answerAQuestion, answerAllQuestions, updateAnswers };
