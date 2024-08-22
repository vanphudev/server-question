"use strict";
const {Answer} = require("../../models/associations");
const {Question} = require("../../models/associations");
const {User} = require("../../models/associations");

const getAnswerWithIdQuestion = async (req, res) => {
   const { questionId } = req.params;

   // Kiểm tra xem questionId có phải là số nguyên hợp lệ hay không
   if (!questionId || !Number.isInteger(Number(questionId))) {
      return res.status(400).json({
         message: "Invalid question ID format",
         status: 400,
         error: "Invalid question ID format",
         getTimestamp: new Date().toISOString(),
      });
   }

   try {
      const id = Number(questionId);

      // Tìm câu hỏi dựa vào questionId và bao gồm thông tin người dùng đã tạo câu hỏi
      const question = await Question.findOne({
         where: { question_id: id },
         include: [
            {
               model: User,
               as: "creator",  // Đặt alias cho liên kết này
               attributes: ["user_id", "user_name", "user_email"],
            },
         ],
      });

      if (!question) {
         return res.status(404).json({
            message: "Question not found",
            status: 404,
            error: "Question not found",
            getTimestamp: new Date().toISOString(),
         });
      }

      // Tìm tất cả câu trả lời của câu hỏi và bao gồm thông tin người dùng đã trả lời câu hỏi
      const answers = await Answer.findAll({
         where: { question_id: id },
         include: [
            {
               model: User,
               as: "responder",  // Đặt alias cho liên kết này
               attributes: ["user_id", "user_name", "user_email"],
            },
         ],
      });

      // Đếm tổng số lượng câu trả lời
      const totalAnswers = answers.length; // Đếm trực tiếp từ kết quả trả về

      res.status(200).json({
         data: {
            question,
            answers,
            totalAnswers,
         },
         status: 200,
         message: "Get all answers successfully",
         getTimestamp: new Date().toISOString(),
      });
   } catch (err) {
      res.status(500).json({
         message: "Load dữ liệu không thành công ::: " + err.message,
         status: 500,
         error: "Error from server",
         getTimestamp: new Date().toISOString(),
      });
   }
};


// const getAnswerWithIdQuestion = async (req, res) => {
//    const {questionId} = req.params;
//    if (!questionId) {
//       return res.status(400).json({
//          message: "Question id is required",
//          status: 400,
//          error: "Question id is required",
//          getTimestamp: new Date().getTime(),
//       });
//    }

//    if (!questionId || !Number.isInteger(Number(questionId))) {
//       return res.status(400).json({
//          message: "Invalid question id format",
//          status: 400,
//          error: "Invalid question id format",
//          getTimestamp: new Date().getTime(),
//       });
//    }

//    try {
//       const id = Number(questionId);
//       const answers = await Answer.findAll({
//          where: {question_id: id},
//       });
//       if (!answers || answers.length === 0) {
//          return res.status(404).json({
//             message: "Answers not found",
//             status: 404,
//             error: "Answers not found",
//             getTimestamp: new Date().getTime(),
//          });
//       }
//       res.status(200).json({
//          data: answers,
//          status: 200,
//          message: "Get all answers successfully",
//          getTimestamp: new Date().getTime(),
//       });
//    } catch (err) {
//       res.status(500).json({
//          message: "Load dữ liệu không thành công ::: " + err.message,
//          status: 500,
//          error: "Error from server",
//          getTimestamp: new Date().getTime(),
//       });
//    }
// };

const createAnswer = async (req, res) => {
   const {content} = req.body;
   const {user} = req;
   const {questionId} = req.params;
   if (!content) {
      return res.status(400).json({
         message: "Content is required",
         status: 400,
         error: "Content is required",
         createTimestamp: new Date().getTime(),
      });
   }
   if (!questionId) {
      return res.status(400).json({
         message: "Question id is required",
         status: 400,
         error: "Question id is required",
         createTimestamp: new Date().getTime(),
      });
   }
   if (!questionId || !Number.isInteger(Number(questionId))) {
      return res.status(400).json({
         message: "Invalid question id format",
         status: 400,
         error: "Invalid question id format",
         getTimestamp: new Date().getTime(),
      });
   }
   try {
      // Check if question exists
      const question = await Question.findByPk(questionId);
      if (!question) {
         return res.status(404).json({
            message: "Question not found",
            status: 404,
            error: "Question not found",
            createTimestamp: new Date().getTime(),
         });
      }
      const newAnswer = await Answer.create({
         answer_content: content,
         user_id: user.userId,
         question_id: questionId,
      });
      res.status(201).json({
         data: newAnswer,
         status: 201,
         message: "Create answer successfully",
         createTimestamp: new Date().getTime(),
      });
   } catch (err) {
      res.status(500).json({
         message: err.message,
         status: 500,
         error: "Error from server",
         createTimestamp: new Date().getTime(),
      });
   }
};

const updateAnswer = async (req, res) => {
   const {content} = req.body;
   const {id} = req.params;
   const {user} = req;
   if (!content) {
      return res.status(400).json({
         message: "Content is required",
         status: 400,
         error: "Content is required",
         updateTimestamp: new Date().getTime(),
      });
   }
   if (!id) {
      return res.status(400).json({
         message: "Answer id is required",
         status: 400,
         error: "Answer id is required",
         updateTimestamp: new Date().getTime(),
      });
   }
   if (!id || !Number.isInteger(Number(id))) {
      return res.status(400).json({
         message: "Invalid question id format",
         status: 400,
         error: "Invalid question id format",
         getTimestamp: new Date().getTime(),
      });
   }
   try {
      const answer = await Answer.findOne({
         where: {answer_id: Number(id)},
      });

      if (!answer) {
         return res.status(404).json({
            message: "Answer not found",
            status: 404,
            error: "Answer not found",
            updateTimestamp: new Date().getTime(),
         });
      }

      if (answer.user_id !== user.userId) {
         return res.status(403).json({
            message: "You are not allowed to update this answer",
            status: 403,
            error: "You are not allowed to update this answer",
            updateTimestamp: new Date().getTime(),
         });
      }

      answer.answer_content = content;
      await answer.save();
      res.status(200).json({
         data: answer,
         status: 200,
         message: "Update answer successfully",
         updateTimestamp: new Date().getTime(),
      });
   } catch (err) {
      res.status(500).json({
         message: err.message,
         status: 500,
         updateTimestamp: new Date().getTime(),
      });
   }
};

const deleteAnswer = async (req, res) => {
   const {id} = req.params;
   const {user} = req;
   if (!id) {
      return res.status(400).json({
         message: "Answer id is required",
         status: 400,
         error: "Answer id is required",
         deleteTimestamp: new Date().getTime(),
      });
   }
   if (!id || !Number.isInteger(Number(id))) {
      return res.status(400).json({
         message: "Invalid question id format",
         status: 400,
         error: "Invalid question id format",
         getTimestamp: new Date().getTime(),
      });
   }
   try {
      const answer = await Answer.findOne({
         where: {answer_id: Number(id)},
      });

      if (!answer) {
         return res.status(404).json({
            message: "Answer not found",
            status: 404,
            error: "Answer not found",
            updateTimestamp: new Date().getTime(),
         });
      }

      if (answer.user_id !== user.userId) {
         return res.status(403).json({
            message: "You are not allowed to delete this answer",
            status: 403,
            error: "You are not allowed to delete this answer",
            updateTimestamp: new Date().getTime(),
         });
      }

      await answer.destroy();
      res.status(200).json({
         status: 200,
         message: "Delete answer successfully",
         deleteTimestamp: new Date().getTime(),
      });
   } catch (err) {
      res.status(500).json({
         message: "Load dữ liệu không thành công ::: " + err.message,
         status: 500,
         error: "Error from server",
         deleteTimestamp: new Date().getTime(),
      });
   }
};

module.exports = {getAnswerWithIdQuestion, createAnswer, updateAnswer, deleteAnswer};
