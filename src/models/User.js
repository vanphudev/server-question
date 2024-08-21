const {DataTypes} = require("sequelize");
const db = require("../db/connecting");

const User = db.define(
   "User",
   {
      user_id: {
         type: DataTypes.INTEGER,
         autoIncrement: true,
         primaryKey: true,
      },
      user_email: {
         type: DataTypes.STRING(255),
         allowNull: true,
         unique: true,
      },
      user_address: {
         type: DataTypes.STRING(255),
         allowNull: true,
      },
      user_name: {
         type: DataTypes.STRING(255),
         allowNull: true,
      },
      user_image_url: {
         type: DataTypes.TEXT,
         allowNull: true,
      },
      user_password: {
         type: DataTypes.STRING(255),
         allowNull: true,
      },
      user_description: {
         type: DataTypes.STRING(500),
         allowNull: true,
      },
      access_token: {
         type: DataTypes.TEXT,
         allowNull: true,
      },
      refresh_token: {
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
      group_id: {
         type: DataTypes.INTEGER,
         references: {
            model: "groups",
            key: "group_id",
         },
      },
   },
   {
      tableName: "users",
      timestamps: true,
      underscored: true,
      charset: "utf8mb4",
      collate: "utf8mb4_unicode_ci",
   }
);

module.exports = User;
