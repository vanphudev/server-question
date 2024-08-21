const {DataTypes} = require("sequelize");
const db = require("../db/connecting");

const GroupRole = db.define(
   "GroupRole",
   {
      group_id: {
         type: DataTypes.INTEGER,
         references: {
            model: "groups",
            key: "group_id",
         },
         primaryKey: true,
      },
      role_id: {
         type: DataTypes.INTEGER,
         references: {
            model: "roles",
            key: "role_id",
         },
         primaryKey: true,
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
      tableName: "group_role",
      timestamps: true,
      underscored: true,
      charset: "utf8mb4",
      collate: "utf8mb4_unicode_ci",
   }
);

module.exports = GroupRole;
