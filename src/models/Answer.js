const {DataTypes} = require("sequelize");
const db = require("../db/connecting");

const Answer = db.define(
   "Answer",
   {
      answer_id: {
         type: DataTypes.INTEGER,
         autoIncrement: true,
         primaryKey: true,
      },
      answer_content: {
         type: DataTypes.TEXT,
         allowNull: true,
      },
      created_at: {
         type: DataTypes.DATE,
         defaultValue: DataTypes.NOW,
      },
      updated_at: {
         type: DataTypes.DATE,
         defaultValue: DataTypes.NOW,
      },
      user_id: {
         type: DataTypes.INTEGER,
         references: {
            model: "users",
            key: "user_id",
         },
      },
      question_id: {
         type: DataTypes.INTEGER,
         references: {
            model: "questions",
            key: "question_id",
         },
      },
   },
   {
      tableName: "answers",
      timestamps: true,
      underscored: true,
      charset: "utf8mb4",
      collate: "utf8mb4_unicode_ci",
   }
);

module.exports = Answer;
