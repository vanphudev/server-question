const jwt = require("jsonwebtoken");
const {User} = require("../models/associations");
require("dotenv").config();

const RefreshAccessToken = async (req, res) => {
   const {refresh_token} = req.body;

   if (!refresh_token) {
      return res
         .status(400)
         .json({message: "Refresh token is required", status: 400, error: "Refresh token is required"});
   }

   try {
      // Xác thực refresh token
      const decoded = jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET);

      // Tìm người dùng với refresh token và user_id tương ứng
      const user = await User.findOne({where: {user_id: decoded.userId, refresh_token: refresh_token}});
      if (!user) {
         return res.status(403).json({message: "Invalid refresh token", status: 403, error: "Invalid refresh token"});
      }

      // Tạo mới access token
      const newAccessToken = jwt.sign({userId: user.user_id}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "15m"}); // Thời gian tồn tại ngắn

      // Gửi access token mới trong response
      res.status(200).json({
         accessToken: newAccessToken,
         message: "Access token refreshed successfully",
         status: 200,
      });
   } catch (error) {
      res.status(401).json({
         message: "Refresh token expired or invalid. Please login again.",
         status: 401,
         error: "Refresh token expired or invalid",
      });
   }
};

module.exports = {RefreshAccessToken};
