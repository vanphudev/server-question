const express = require("express");
const {authenticate} = require("../../middlewares/authenticate");
const {authorize} = require("../../middlewares/authorize");
const {
   getAllQuestions,
   createQuestions,
   updateQuestions,
   deleteQuestions,
   filterQuestionsByDate,
   Pagination,
} = require("../../services/Questions/CRUDQuestion");
const routesQuestions = express.Router();

routesQuestions.get("/get-all", authenticate, authorize("/questions/get-all"), getAllQuestions);

routesQuestions.post("/create", authenticate, authorize("/questions/create"), createQuestions);

routesQuestions.put("/update/:id", authenticate, authorize("/questions/update"), updateQuestions);

routesQuestions.delete("/delete/:id", authenticate, authorize("/questions/delete"), deleteQuestions);

routesQuestions.get("/filter-by-date", authenticate, authorize("/questions/filter-by-date"), filterQuestionsByDate);

routesQuestions.get("/pagination", authenticate, authorize("/questions/pagination"), Pagination);

module.exports = {
   routesQuestions,
};
