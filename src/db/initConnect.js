const {Sequelize} = require("sequelize");
const databaseConfig = require("../configs/database");

class ConnectDatabase {
   constructor() {
      this.connection = new Sequelize(databaseConfig.database, databaseConfig.username, databaseConfig.password, {
         host: databaseConfig.host,
         port: databaseConfig.port,
         dialect: databaseConfig.dialect,
         logging: false,
         connectTimeout: 6000 * 10,
      });
   }

   static getDatabaseUniqueIdentifier(database) {
      return Buffer.from(JSON.stringify(database)).toString("base64");
   }

   static getInstance() {
      if (!this.instance) {
         this.instance = new ConnectDatabase();
      }
      return this.instance;
   }

   static closeDatabase() {
      if (this.instance) {
         this.instance.connection.close();
         delete this.instance;
      }
   }

   syncModels() {
      return this.connection.sync();
   }

   async authenticate() {
      return await this.connection.authenticate();
   }

   getSequelize() {
      return this.connection;
   }
}

module.exports = ConnectDatabase;
