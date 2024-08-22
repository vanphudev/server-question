const {Question} = require("../../models/associations");
const {Answer} = require("../../models/associations");
const {User} = require("../../models/associations");
const {Op} = require("sequelize");

const getAllQuestions = async (req, res) => {
   const {groupName} = req;
   const {user} = req;

   if (!groupName) {
      return res.status(403).json({
         message: "Bạn không có quyền truy cập đường link này!",
         status: 403,
         error: "You are not allowed to access this route",
         getTimestamp: new Date().getTime(),
      });
   }

   try {
      const isAdmin = groupName === "admin";
      let questions;

      if (isAdmin) {
         questions = await Question.findAll({
            include: [
               {
                  model: Answer,
                  include: {
                     model: User,
                     attributes: ["user_id", "user_name", "user_image_url"],
                  },
               },
               // Include User (người đặt câu hỏi)
               {
                  model: User,
                  as: "asker",
                  attributes: ["user_id", "user_name", "user_image_url"],
               },
            ],
         });
      } else {
         questions = await Question.findAll({
            where: {user_id: user.userId},
            include: [
               {
                  model: Answer,
                  include: {
                     model: User,
                     attributes: ["user_id", "user_name", "user_image_url"],
                  },
               },
               // Include User (người đặt câu hỏi)
               {
                  model: User,
                  as: "asker",
                  attributes: ["user_id", "user_name", "user_image_url"],
               },
            ],
         });
      }

      const responseQuestions = questions.map((question) => {
         const questionData = question.toJSON();

         // Lấy danh sách người dùng không trùng lặp đã trả lời câu hỏi
         const uniqueAnswerers = questionData.Answers.reduce((acc, answer) => {
            const userId = answer.User.user_id;
            if (!acc.some((user) => user.user_id === userId)) {
               acc.push(answer.User);
            }
            return acc;
         }, []);

         // Thêm thuộc tính isQuestionByAdmin
         const isQuestionByAdmin = isAdmin ? question.user_id === user.userId : true;

         return {
            ...questionData,
            answerers: uniqueAnswerers,
            isQuestionByAdmin,
            asker: question.asker, // Thông tin người đặt câu hỏi
         };
      });

      res.status(200).json({
         data: responseQuestions,
         status: 200,
         message: "Get all questions successfully",
         getTimestamp: new Date().getTime(),
      });
   } catch (err) {
      res.status(500).json({
         message: "Load dữ liệu không thành công ::: " + err.message,
         status: 500,
         error: "Error from server",
         getTimestamp: new Date().getTime(),
      });
   }
};

const createQuestions = async (req, res) => {
   const {title, content} = req.body;
   console.log(req.body);

   const {user} = req;
   if (!title || !content) {
      return res.status(400).json({
         message: "Title and content are required",
         status: 400,
         error: "Title and content are required",
         createTimestamp: new Date().getTime(),
      });
   }
   try {
      const newQuestion = await Question.create({
         question_title: title,
         question_description: content,
         user_id: user.userId,
      });
      res.status(201).json({
         data: newQuestion,
         status: 201,
         message: "Create question successfully",
         createTimestamp: new Date().getTime(),
      });
   } catch (err) {
      res.status(500).json({
         message: "Load dữ liệu không thành công ::: " + err.message,
         status: 500,
         error: "Error from server",
         createTimestamp: new Date().getTime(),
      });
   }
};

const updateQuestions = async (req, res) => {
   const {title, content} = req.body;
   const questionId = req.params.id;

   if (!title || !content) {
      return res.status(400).json({
         message: "Title and content are required",
         status: 400,
         error: "Title and content are required",
         updateTimestamp: new Date().getTime(),
      });
   }
   if (!questionId) {
      return res.status(400).json({
         message: "Question id is required",
         status: 400,
         error: "Question id is required",
         updateTimestamp: new Date().getTime(),
      });
   }
   try {
      const question = await Question.findOne({
         where: {question_id: questionId},
      });

      if (!question) {
         return res.status(404).json({
            message: "Question not found",
            status: 404,
            error: "Question not found",
            updateTimestamp: new Date().getTime(),
         });
      }
      await question.update({
         question_title: title,
         question_content: content,
      });

      res.status(200).json({
         data: question,
         status: 200,
         message: "Update question successfully",
         updateTimestamp: new Date().getTime(),
      });
   } catch (err) {
      res.status(500).json({
         message: "Load dữ liệu không thành công ::: " + err.message,
         status: 500,
         error: "Error from server",
         updateTimestamp: new Date().getTime(),
      });
   }
};

const deleteQuestions = async (req, res) => {
   const questionId = req.params.id;
   if (!questionId) {
      return res.status(400).json({
         message: "Question id is required",
         status: 400,
         error: "Question id is required",
         deleteTimestamp: new Date().getTime(),
      });
   }
   try {
      const question = await Question.findOne({
         where: {question_id: questionId},
      });
      if (!question) {
         return res.status(404).json({
            message: "Question not found",
            status: 404,
            error: "Question not found",
            deleteTimestamp: new Date().getTime(),
         });
      }
      await question.destroy();
      res.status(200).json({
         data: question,
         status: 200,
         message: "Delete question successfully",
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

const filterQuestionsByDate = async (req, res) => {
   const {groupName} = req;
   const {user} = req;
   const {startDate, endDate} = req.query;

   if (!groupName) {
      return res.status(403).json({
         message: "Bạn không có quyền truy cập đường link này!",
         status: 403,
         error: "You are not allowed to access this route",
         getTimestamp: new Date().getTime(),
      });
   }

   if (!startDate || !endDate) {
      return res.status(400).json({
         message: "Start date and end date are required",
         status: 400,
         error: "Start date and end date are required",
         filterTimestamp: new Date().getTime(),
      });
   }

   if (new Date(startDate) > new Date(endDate)) {
      return res.status(400).json({
         message: "Start date must be less than end date",
         status: 400,
         error: "Start date must be less than end date",
         filterTimestamp: new Date().getTime(),
      });
   }

   if (isNaN(new Date(startDate).getTime()) || isNaN(new Date(endDate).getTime())) {
      return res.status(400).json({
         message: "Invalid date format",
         status: 400,
         error: "Invalid date format",
         filterTimestamp: new Date().getTime(),
      });
   }

   try {
      const isAdmin = groupName === "admin";
      let whereClause = {};
      if (startDate && endDate) {
         whereClause.createdAt = {[Op.between]: [startDate, endDate]};
      }

      if (!isAdmin) {
         whereClause.user_id = user.userId;
      }

      const questions = await Question.findAll({
         where: whereClause,
         include: [
            {
               model: Answer,
               include: {
                  model: User,
                  attributes: ["user_id", "user_name", "user_image_url"],
               },
            },
         ],
      });

      const responseQuestions = questions.map((question) => {
         const questionData = question.toJSON();
         const uniqueAnswerers = questionData.Answers.reduce((acc, answer) => {
            const userId = answer.User.user_id;
            if (!acc.some((user) => user.user_id === userId)) {
               acc.push(answer.User);
            }
            return acc;
         }, []);
         const isQuestionByAdmin = isAdmin ? question.user_id === user.userId : true;
         return {
            ...questionData,
            answerers: uniqueAnswerers,
            isQuestionByAdmin,
         };
      });
      res.status(200).json({
         data: responseQuestions,
         status: 200,
         message: "Get all questions successfully",
         getTimestamp: new Date().getTime(),
      });
   } catch (err) {
      res.status(500).json({
         message: "Load dữ liệu không thành công ::: " + err.message,
         status: 500,
         error: "Error from server",
         getTimestamp: new Date().getTime(),
      });
   }
};

const Pagination = async (req, res) => {
   const {groupName} = req;
   const {user} = req;
   const {startDate, endDate} = req.query;
   const page = parseInt(req.query.page) || 1;
   const limit = parseInt(req.query.limit) || 10;
   const offset = (page - 1) * limit;

   if (!groupName) {
      return res.status(403).json({
         message: "Bạn không có quyền truy cập đường link này!",
         status: 403,
         error: "You are not allowed to access this route",
         getTimestamp: new Date().getTime(),
      });
   }

   // Validate startDate và endDate
   if (startDate || endDate) {
      if (!startDate || !endDate) {
         return res.status(400).json({
            message: "Start date and end date are required",
            status: 400,
            error: "Start date and end date are required",
            filterTimestamp: new Date().getTime(),
         });
      }

      if (new Date(startDate) > new Date(endDate)) {
         return res.status(400).json({
            message: "Start date must be less than end date",
            status: 400,
            error: "Start date must be less than end date",
            filterTimestamp: new Date().getTime(),
         });
      }

      if (isNaN(new Date(startDate).getTime()) || isNaN(new Date(endDate).getTime())) {
         return res.status(400).json({
            message: "Invalid date format",
            status: 400,
            error: "Invalid date format",
            filterTimestamp: new Date().getTime(),
         });
      }
   }

   try {
      const isAdmin = groupName === "admin";
      let whereClause = {};

      // Thêm điều kiện lọc ngày tháng nếu có
      if (startDate && endDate) {
         const formattedStartDate = new Date(startDate).toISOString();
         const formattedEndDate = new Date(endDate).toISOString();

         whereClause.createdAt = {
            [Op.between]: [formattedStartDate, formattedEndDate],
         };
      }

      if (!isAdmin) {
         whereClause.user_id = user.userId;
      }

      const questions = await Question.findAll({
         where: whereClause,
         include: [
            {
               model: Answer,
               include: {
                  model: User,
                  attributes: ["user_id", "user_name", "user_image_url"],
               },
            },
         ],
         limit: limit,
         offset: offset,
      });

      const totalQuestions = await Question.count({where: whereClause});
      const totalPages = Math.ceil(totalQuestions / limit);

      // Chuyển đổi dữ liệu để trả về
      const responseQuestions = questions.map((question) => {
         const questionData = question.toJSON();

         const uniqueAnswerers = questionData.Answers.reduce((acc, answer) => {
            const userId = answer.User.user_id;
            if (!acc.some((user) => user.user_id === userId)) {
               acc.push(answer.User);
            }
            return acc;
         }, []);

         const isQuestionByAdmin = isAdmin ? question.user_id === user.userId : true;

         return {
            ...questionData,
            answerers: uniqueAnswerers,
            isQuestionByAdmin,
         };
      });

      res.status(200).json({
         data: responseQuestions,
         status: 200,
         message: "Get all questions successfully",
         getTimestamp: new Date().getTime(),
         currentPage: page,
         totalPages: totalPages,
      });
   } catch (err) {
      res.status(500).json({
         message: "Load dữ liệu không thành công ::: " + err.message,
         status: 500,
         error: "Error from server",
         getTimestamp: new Date().getTime(),
      });
   }
};

module.exports = {
   getAllQuestions,
   createQuestions,
   updateQuestions,
   deleteQuestions,
   filterQuestionsByDate,
   Pagination,
};
