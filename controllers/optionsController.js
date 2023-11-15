const questionModal = require("../models/QuestionModel");
const optionModal = require("../models/OptionModel");

const createOptions = async (req, res) => {
    const { choice, question_id, correct_answer } = req.body;

    if (!choice || !question_id || !correct_answer) return res.status(400).json({ message: "Required fields cannot be empty" });

    try {
        const questionExists = await questionModal.findOne({ where: question_id });
        if (!questionExists) return res.status(400).json({ message: "No questions match the id you provided" });

        const options = await optionModal.create({
            question_id: question_id,
            choice: choice,
            correct_answer: correct_answer,
        });
        res.status(201).json(options);
    } catch (error) {
        res.status(500).json({ message: error });
    }
};

module.exports = createOptions;
