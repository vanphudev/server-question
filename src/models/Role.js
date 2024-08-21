const {DataTypes} = require("sequelize");
const db = require("../db/connecting");

const Role = db.define(
   "Role",
   {
      role_id: {
         type: DataTypes.INTEGER,
         autoIncrement: true,
         primaryKey: true,
      },
      role_name: {
         type: DataTypes.STRING(255),
         allowNull: true,
      },
      role_route: {
         type: DataTypes.TEXT,
         allowNull: true,
      },
      role_description: {
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
      tableName: "roles",
      timestamps: true,
      underscored: true,
      charset: "utf8mb4",
      collate: "utf8mb4_unicode_ci",
   }
);

module.exports = Role;
