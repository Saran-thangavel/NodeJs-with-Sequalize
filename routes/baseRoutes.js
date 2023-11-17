const express = require("express");
const router = express.Router();
const verifyJWT = require("../middleware/verifyJWT");
const UsersController = require("../controllers/UserController");
const LoginController = require("../controllers/authController");

const QuestionController = require("../controllers/questionController");
const optionController = require("../controllers/optionsController");
const answerController = require("../controllers/answerController");
const scoreController = require("../controllers/scoreController");

router.post("/createUser", UsersController.createUser);
router.post("/login", LoginController.handleLogin);
router.post("/refreshToken", LoginController.handleRefreshToken);
router.get("/users", verifyJWT, UsersController.getAllUsers);
router.get("/user", verifyJWT, UsersController.getUser);
router.put("/updateUser/:id", verifyJWT, UsersController.updateUser);
router.delete("/deleteUser/:id", verifyJWT, UsersController.deleteUser);

router.get("/questions", verifyJWT, QuestionController.getAllQuestions);
router.get("/question", verifyJWT, QuestionController.getQuestionById);
router.post("/createQuestion", verifyJWT, QuestionController.createQuestion);
router.post("/createOption", verifyJWT, optionController);
router.put("/updateQuestion/:id", verifyJWT, QuestionController.updateQuestion);
router.delete("/deleteQuestion/:id", verifyJWT, QuestionController.deleteQuestion);
router.post("/submitAnswer", verifyJWT, answerController.answerAQuestion);
router.post("/submitAllAnswers", verifyJWT, answerController.answerAllQuestions);
router.post("/updateAnswers", verifyJWT, answerController.updateAnswers);
router.get("/getQuizScore", verifyJWT, scoreController.getUserScore);

module.exports = router;
