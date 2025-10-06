const { Sequelize } = require('sequelize');
require('dotenv').config();

let instance = null;

class Database {
  constructor() {
    if (!instance) {
      instance = new Sequelize(
        process.env.DB_NAME,
        process.env.DB_USER,
        process.env.DB_PASSWORD,
        {
          host: process.env.DB_HOST,
          port: process.env.DB_PORT,
          dialect: 'postgres',
          logging: false,
          define: {
            freezeTableName: true,
            timestamps: false
          },
          pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
          }
        }
      );
    }
    return instance;
  }
}

const sequelize = new Database();

module.exports = sequelize;