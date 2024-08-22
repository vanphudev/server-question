const {User, Group, Role, GroupRole} = require("../models/associations");

const authorize = (requiredRoute) => async (req, res, next) => {
   try {
      const {user} = req;
      const _user = await User.findOne({where: {user_id: user.userId}});
      if (!_user) {
         return res.status(404).json({message: "User không tồn tại", status: 404, error: "User not found"});
      }
      const userRoutesData = await getUserRoutes(_user.getDataValue("user_id"));
      const {roles, groupName} = userRoutesData;
      const roleRoutes = roles.map((role) => role.roleRoute.toLowerCase().trim());
      const cleanedRequiredRoute = requiredRoute.trim().toLowerCase();
      const isAllowedRoute = roleRoutes.includes(cleanedRequiredRoute);
      if (isAllowedRoute) {
         req.groupName = groupName;
         return next();
      } else {
         return res.status(403).json({
            message: "Bạn không có quyền truy cập đường link này!",
            status: 403,
            error: "You are not allowed to access this route",
         });
      }
   } catch (error) {
      return res.status(500).json({
         message: error.message,
         status: 500,
         error: "Internal server error",
      });
   }
};

module.exports = {
   authorize,
};

// Hàm lấy danh sách route của người dùng từ các roles
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
                     attributes: ["role_name", "role_route"],
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

      // Lấy tên nhóm
      const groupName = user.Group.group_name;

      // Lấy danh sách các role và route tương ứng
      const roles = user.Group.Roles.map((role) => ({
         roleName: role.role_name,
         roleRoute: role.role_route,
      }));

      if (roles.length === 0) {
         throw new Error("User has no access rights");
      }

      // Trả về danh sách các quyền và tên nhóm
      return {
         groupName,
         roles,
      };
   } catch (error) {
      throw error;
   }
};
