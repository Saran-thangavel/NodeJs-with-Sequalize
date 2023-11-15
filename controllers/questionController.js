const questionModal = require("../models/QuestionModel");
const optionModal = require("../models/OptionModel");

const createQuestion = async (req, res) => {
    const { desc } = req.body;
    console.log(req.body, "body");

    if (!desc) {
        return res.status(400).json({ message: "Required fields cannot be empty" });
    }

    try {
        const question = await questionModal.create({
            desc: desc,
        });
        console.log(question, "createdQuestion");
        res.status(201).json(question);
    } catch (error) {
        res.status(500).json({ message: error });
    }
};

const getAllQuestions = async (req, res) => {
    try {
        const questions = await questionModal.findAll({ attributes: { exclude: ["createdAt", "updatedAt"] } });
        const questionId = questions.map((question) => {
            return question.id;
        });

        const options = await optionModal.findAll({ where: { question_id: questionId }, attributes: { exclude: ["createdAt", "updatedAt"] } });

        // Construct the JSON response with questions and their corresponding choices
        const questionsWithChoices = questions.map((question) => {
            const choices = options
                .filter((option) => option.question_id === question.id)
                ?.map((data) => {
                    return {
                        id: data?.id,
                        choice: data?.choice,
                    };
                });
            return {
                question: question,
                choices: choices,
            };
        });

        return res.status(200).json(questionsWithChoices);
    } catch (error) {
        res.status(500).json({ message: error });
    }
};

const getQuestionById = async (req, res) => {
    const id = req.query.id;
    if (!id) {
        return res.status(400).json({ message: "Please provide question id." });
    }

    try {
        const getQuestion = await questionModal.findOne({ where: { id: id }, attributes: { exclude: ["createdAt", "updatedAt"] } });
        const choices = await optionModal.findAll({
            where: { question_id: id },
            attributes: { exclude: ["createdAt", "updatedAt", "question_id", "ques_id", "correct_answer"] },
        });
        if (!getQuestion) {
            return res.status(404).json({ message: "No data matches with the id you provided." });
        }
        res.status(200).json({ question: getQuestion, choices: choices });
    } catch (error) {
        return res.status(500).json({ message: error });
    }
};

const updateQuestion = async (req, res) => {
    const id = req.params.id;
    const { desc } = req.body;

    if (!desc) {
        return res.status(404).json({ message: "Required parameter should not be empty." });
    }

    try {
        const question = await questionModal.findOne({ where: { id: id } });
        if (!question) {
            return res.status(404).json({ message: "No such question found." });
        }

        question.desc = desc;
        await question.save();
        res.status(200).json(question);
    } catch (error) {
        res.status(500).json({ message: error });
    }
};

const deleteQuestion = async (req, res) => {
    const id = req.params.id;
    if (!id || isNaN(parseInt(id))) {
        return res.status(404).json({ message: "Id is required." });
    }

    try {
        const question = await questionModal.findOne({ where: { id: id } });
        if (!question) {
            return res.status(404).json({ message: "No such quesiton found." });
        }

        await question.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error });
    }
};

module.exports = { createQuestion, getAllQuestions, getQuestionById, updateQuestion, deleteQuestion };
