const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {Role, Group, User} = require("../../models/associations");
require("dotenv").config();

const register = async (req, res) => {
   const {name, email, password, image_url} = req.body;
   const checkEmail = await User.findOne({where: {user_email: email}});
   if (checkEmail) {
      return res.status(400).send({message: "Email đã tồn tại.", status: 400, error: "Email already exists."});
   }
   try {
      const salt = bcrypt.genSaltSync(10);
      const hashPassword = bcrypt.hashSync(password, salt);
      const newUser = await User.create({
         user_email: email,
         user_password: hashPassword,
         user_name: name,
         user_image_url: image_url,
      });
      res.status(201).send({message: "Tạo tài khoản thành công.", status: 201});
   } catch (error) {
      res.status(500).send({
         message: "Load dữ liệu không thành công ::: " + err.message,
         status: 500,
         error: "Error from server",
      });
   }
};

const login = async (req, res) => {
   const {email, password} = req.body;
   const user = await User.findOne({where: {user_email: email}});
   if (!user) {
      return res
         .status(401)
         .json({message: "Email hoặc mật khẩu không đúng.", status: 401, error: "Email or password is incorrect."});
   }
   const validPassword = await bcrypt.compare(password, user.user_password);
   if (!validPassword) {
      return res
         .status(401)
         .json({message: "Email hoặc mật khẩu không đúng.", status: 401, error: "Email or password is incorrect."});
   }
   const accessToken = await jwt.sign({userId: user.user_id}, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: 60 * 60,
   });
   const refreshToken = await jwt.sign({userId: user.user_id}, process.env.REFRESH_TOKEN_SECRET, {expiresIn: "7 days"});
   try {
      user.access_token = accessToken;
      user.refresh_token = refreshToken;
      await user.save();
      res.status(200).json({
         accessToken: accessToken,
         refreshToken: refreshToken,
         message: "Đăng nhập thành công.",
         status: 200,
      });
   } catch (error) {
      res.status(500).json({
         message: "Load dữ liệu không thành công ::: " + err.message,
         status: 500,
         error: "Error from server",
      });
   }
};

module.exports = {login, register};
