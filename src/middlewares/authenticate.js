const jwt = require("jsonwebtoken");
require("dotenv").config();

const authenticate = (req, res, next) => {
   const token = req.token;
   if (!token) {
      return res.status(401).json({message: "Token không tồn tại", status: 401, error: "Token not found"});
   }
   try {
      const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      if (decode) {
         req.user = decode;
         return next();
      } else {
         res.status(403).json({message: "Token không hợp lệ", status: 403, error: "Token not valid"});
      }
   } catch (error) {
      if (error.name === "TokenExpiredError") {
         return res.status(419).json({
            message: "Token đã hết hạn",
            status: 419,
            expiredAt: error.expiredAt,
            error: "Token expired",
         });
      }
      return res.status(403).json({
         message: "Lỗi xác thực: " + error.message,
         status: 403,
         error: "Token not valid",
      });
   }
};

module.exports = {
   authenticate,
};
