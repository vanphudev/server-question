const jwt = require("jsonwebtoken");
const {User} = require("../models/associations");
require("dotenv").config();

const RefreshAccessToken = async (req, res) => {
   if (!req.header("refreshToken")) {
      return res
         .status(400)
         .json({message: "Refresh token is required", status: 400, error: "Refresh token is required"});
   }
   const refreshToken = req.header("refreshToken");
   try {
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
      const user = await User.findOne({where: {user_id: decoded.userId, refresh_token: refreshToken}});
      if (!user) {
         return res.status(403).json({message: "Invalid refresh token", status: 403, error: "Invalid refresh token"});
      }
      // Refresh token còn hợp lệ, cấp phát access token mới
      const newAccessToken = jwt.sign({userId: user.user_id}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "7 days"});
      user.access_token = newAccessToken;
      await user.save();
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
