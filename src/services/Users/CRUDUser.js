const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {User} = require("../../models/associations");
var validator = require("validator");
require("dotenv").config();

const register = async (req, res) => {
   const {name, email, password, image_url} = req.body;

   try {
      // Kiểm tra xem email đã tồn tại chưa
      const checkEmail = await User.findOne({where: {user_email: email}});
      if (checkEmail) {
         return res.status(400).send({
            message: "Email đã tồn tại.",
            status: 400,
            error: "Email already exists.",
         });
      }

      // Hash mật khẩu
      const salt = bcrypt.genSaltSync(10);
      const hashPassword = bcrypt.hashSync(password, salt);

      // Tạo người dùng mới
      await User.create({
         user_email: email,
         user_password: hashPassword,
         user_name: name,
         user_image_url: image_url,
      });

      res.status(201).send({
         message: "Tạo tài khoản thành công.",
         status: 201,
      });
   } catch (error) {
      res.status(500).send({
         message: "Load dữ liệu không thành công ::: " + error.message,
         status: 500,
         error: "Error from server",
      });
   }
};

const login = async (req, res) => {
   const {email, password} = req.body;
   try {
      if (!email && !password) {
         return res.status(400).json({
            message: "Email hoặc mật khẩu không được để trống.",
            status: 400,
            error: "Email and password is required.",
         });
      }

      // Kiểm tra xem email có rỗng không
      if (!email) {
         return res.status(400).json({
            message: "Email không được để trống.",
            status: 400,
            error: "Email is required.",
         });
      }

      // Kiểm tra xem password có rỗng không
      if (!password) {
         return res.status(400).json({
            message: "Mật khẩu không được để trống.",
            status: 400,
            error: "Password is required.",
         });
      }

      // Kiểm tra xem email có rỗng không và đúng định dạng không
      if (validator.isEmail(email) == false) {
         return res.status(400).json({
            message: "Email không hợp lệ.",
            status: 400,
            error: "Email is not in correct format!",
         });
      }

      // Kiểm tra xem người dùng có tồn tại không
      const user = await User.findOne({where: {user_email: email}});
      if (!user) {
         return res.status(401).json({
            message: "Email hoặc mật khẩu không đúng.",
            status: 401,
            error: "Email or password is incorrect.",
         });
      }

      // So sánh mật khẩu
      const validPassword = await bcrypt.compare(password, user.user_password);
      if (!validPassword) {
         return res.status(401).json({
            message: "Email hoặc mật khẩu không đúng.",
            status: 401,
            error: "Email or password is incorrect.",
         });
      }

      // Tạo access token và refresh token
      const accessToken = jwt.sign({userId: user.user_id}, process.env.ACCESS_TOKEN_SECRET, {
         expiresIn: "5m",
      });
      const refreshToken = jwt.sign({userId: user.user_id}, process.env.REFRESH_TOKEN_SECRET, {
         expiresIn: "100 days",
      });

      // Lưu access token và refresh token vào cơ sở dữ liệu
      user.access_token = accessToken;
      user.refresh_token = refreshToken;
      await user.save();

      res.status(200).json({
         user: {
            user_id: user.user_id,
            user_name: user.user_name,
            user_email: user.user_email,
            user_image_url: user.user_image_url,
         },
         accessToken: accessToken,
         refreshToken: refreshToken,
         message: "Login successful",
         status: 200,
      });
   } catch (error) {
      if (error.message == "Expected a string but received a Array") {
         return res.status(444).json({
            message: "Load dữ liệu không thành công ::: " + error.message,
            status: 400,
            error: "Error from server",
         });
      }
      res.status(500).json({
         message: "Load dữ liệu không thành công ::: " + error.message,
         status: 500,
         error: "Error from server",
      });
   }
};

module.exports = {login, register};
