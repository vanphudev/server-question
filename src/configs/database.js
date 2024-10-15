// const {MySqlDialect} = require("@sequelize/mysql");

require("dotenv").config();

// Thông tin cấu hình cơ sở dữ liệu
const databaseConfig = {
   host: process.env.DB_HOST || "localhost",
   port: parseInt(process.env.DB_PORT, 10) || 3366,
   username: process.env.DB_USER || "root",
   password: process.env.DB_PASSWORD || "",
   database: process.env.DB_NAME || "question_application", // Đổi từ dbName thành database
   dialect: "mysql", // Sử dụng 'mysql' thay vì MySqlDialect
};

module.exports = databaseConfig;
