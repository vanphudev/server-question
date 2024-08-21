const Role = require("./Role");
const Group = require("./Group");
const GroupRole = require("./GroupRole");
const User = require("./User");
const Question = require("./Question");
const Answer = require("./Answer");

Role.belongsToMany(Group, {
   through: GroupRole,
   foreignKey: "role_id",
});
Group.belongsToMany(Role, {
   through: GroupRole,
   foreignKey: "group_id",
});

Group.hasMany(User, {
   foreignKey: "group_id",
});
User.belongsTo(Group, {
   foreignKey: "group_id",
});

User.hasMany(Question, {
   foreignKey: "user_id",
});
Question.belongsTo(User, {
   foreignKey: "user_id",
});

Question.hasMany(Answer, {
   foreignKey: "question_id",
});

Answer.belongsTo(Question, {
   foreignKey: "question_id",
});

Answer.belongsTo(User, {foreignKey: "user_id"});
User.hasMany(Answer, {foreignKey: "user_id"});

module.exports = {
   Role,
   Group,
   GroupRole,
   User,
   Question,
   Answer,
};
