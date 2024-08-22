const {Sequelize} = require("sequelize");
const databaseConfig = require("../configs/database");

class ConnectDatabase {
   // Khởi tạo kết nối với database
   constructor() {
      this.connection = new Sequelize(databaseConfig.database, databaseConfig.username, databaseConfig.password, {
         host: databaseConfig.host,
         port: databaseConfig.port,
         dialect: databaseConfig.dialect,
         logging: false,
         connectTimeout: 6000 * 10,
      });
   }

   // Lấy unique identifier của database
   static getDatabaseUniqueIdentifier(database) {
      return Buffer.from(JSON.stringify(database)).toString("base64");
   }

   // Lấy instance của ConnectDatabase
   static getInstance() {
      if (!this.instance) {
         this.instance = new ConnectDatabase();
      }
      return this.instance;
   }

   // Đóng kết nối với database
   static closeDatabase() {
      if (this.instance) {
         this.instance.connection.close();
         delete this.instance;
      }
   }

   // Đồng bộ model với database
   syncModels() {
      return this.connection.sync();
   }

   // Kiểm tra kết nối với database
   async authenticate() {
      return await this.connection.authenticate();
   }

   // Lấy instance của Sequelize
   getSequelize() {
      return this.connection;
   }
}

module.exports = ConnectDatabase;
