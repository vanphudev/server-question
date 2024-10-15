const ConnectDatabase = require("./initConnect");
const dbInstance = ConnectDatabase.getInstance();

try {
   dbInstance.authenticate();
   console.log("Kết nối cơ sở dữ liệu thành công");
   const db = dbInstance.getSequelize();
   module.exports = db;
} catch (error) {
   console.error("Kết nối thất bại ::: ", error);
}
