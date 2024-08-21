const express = require("express");
const {authenticate} = require("../../middlewares/authenticate");
const {authorize} = require("../../middlewares/authorize");
const {
   getAnswerWithIdQuestion,
   createAnswer,
   updateAnswer,
   deleteAnswer,
} = require("../../services/Answers/CRUDAnswer");
const routesAnswers = express.Router();

routesAnswers.get("/get-answer/:questionId", authenticate, authorize("/answers/get-answer"), getAnswerWithIdQuestion);

routesAnswers.post("/create/:questionId", authenticate, authorize("/answers/create"), createAnswer);

routesAnswers.put("/update/:id", authenticate, authorize("/answers/update"), updateAnswer);

routesAnswers.delete("/delete/:id", authenticate, authorize("/answers/delete"), deleteAnswer);

module.exports = {
   routesAnswers,
};
