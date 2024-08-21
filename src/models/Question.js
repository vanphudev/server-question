const {DataTypes} = require("sequelize");
const db = require("../db/connecting");

const Question = db.define(
   "Question",
   {
      question_id: {
         type: DataTypes.INTEGER,
         autoIncrement: true,
         primaryKey: true,
      },
      question_title: {
         type: DataTypes.STRING(255),
         allowNull: true,
      },
      question_description: {
         type: DataTypes.TEXT,
         allowNull: true,
      },
      question_likes: {
         type: DataTypes.INTEGER,
         defaultValue: 0,
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
   },
   {
      tableName: "questions",
      timestamps: true,
      underscored: true,
      charset: "utf8mb4",
      collate: "utf8mb4_unicode_ci",
   }
);

module.exports = Question;
