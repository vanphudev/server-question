const {DataTypes} = require("sequelize");
const db = require("../db/connecting");

const Group = db.define(
   "Group",
   {
      group_id: {
         type: DataTypes.INTEGER,
         autoIncrement: true,
         primaryKey: true,
      },
      group_name: {
         type: DataTypes.STRING(255),
         allowNull: true,
      },
      group_description: {
         type: DataTypes.STRING(255),
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
   },
   {
      tableName: "groups",
      timestamps: true,
      underscored: true,
      charset: "utf8mb4",
      collate: "utf8mb4_unicode_ci",
   }
);

module.exports = Group;
