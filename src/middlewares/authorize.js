const jwt = require("jsonwebtoken");
const {User, Group, Role, GroupRole} = require("../models/associations");

const authorize = (requiredRoute) => async (req, res, next) => {
   try {
      const {user} = req;
      const _user = await User.findOne({where: {user_id: user.userId}});
      if (!_user) {
         return res.status(404).json({message: "User không tồn tại", status: 404, error: "User not found"});
      }

      const userRoutesData = await getUserRoutes(_user.getDataValue("user_id"));
      const {roles, groupName} = userRoutesData; // Lấy danh sách roles từ userRoutesData

      // Lấy tất cả các route từ roles
      const roleRoutes = roles.map((role) => role.roleRoute);
      // Chuyển các route và requiredRoute về chữ thường
      const cleanedRequiredRoute = requiredRoute.trim().toLowerCase();
      const isAllowedRoute = roleRoutes.some((route) => route.trim().toLowerCase() === cleanedRequiredRoute);

      if (isAllowedRoute) {
         req.groupName = groupName;
         next();
      } else {
         res.status(403).json({
            message: "Bạn không có quyền truy cập đường link này!",
            status: 403,
            error: "You are not allowed to access this route",
         });
      }
   } catch (error) {
      res.status(500).json({
         message: error.message,
         error: "You are not allowed to access this route",
         status: 500,
      });
   }
};

module.exports = {
   authorize,
};

const getUserRoutes = async (userId) => {
   try {
      const user = await User.findOne({
         where: {user_id: userId},
         include: [
            {
               model: Group,
               as: "Group",
               include: [
                  {
                     model: Role,
                     as: "Roles",
                     through: {model: GroupRole},
                     attributes: ["role_name", "role_route"], // Lấy cả role_name và role_route
                  },
               ],
            },
         ],
      });

      if (!user) {
         throw new Error("User not found");
      }

      if (!user.Group) {
         throw new Error("User does not belong to any group");
      }

      // Lấy tên nhóm (group_name)
      const groupName = user.Group.group_name;

      // Lấy danh sách các route và tên role
      const roles = user.Group.Roles.map((role) => ({
         roleName: role.role_name,
         roleRoute: role.role_route,
      }));

      if (roles.length === 0) {
         throw new Error("User has no access rights");
      }

      // Trả về group name và danh sách các quyền
      return {
         groupName,
         roles,
      };
   } catch (error) {
      throw error;
   }
};
