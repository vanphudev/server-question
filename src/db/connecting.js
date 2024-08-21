const ConnectDatabase = require("./initConnect");
const dbInstance = ConnectDatabase.getInstance();

try {
   dbInstance.authenticate();
   console.log("Connection has been established successfully.");
   const db = dbInstance.getSequelize();
   module.exports = db;
} catch (error) {
   console.error("Unable to connect to the database:", error);
}
