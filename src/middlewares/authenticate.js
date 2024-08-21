const jwt = require("jsonwebtoken");
require("dotenv").config();

const authenticate = (req, res, next) => {
   const token = req.header("accessToken");
   try {
      const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      if (decode) {
         req.user = decode;
         return next();
      } else {
         res.status(401).json({message: "Token không hợp lệ", status: 401, error: "token not valid"});
      }
   } catch (error) {
      if (error.name === "TokenExpiredError") {
         return res
            .status(401)
            .json({message: "Token đã hết hạn", status: 401, expiredAt: error.expiredAt, error: "token expired"});
      }
      return res.status(401).json({message: "Lỗi  ::: " + error.message, status: 401, error: "token not valid"});
   }
};

module.exports = {
   authenticate,
};
