const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Priority = sequelize.define('Priority', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false, unique: true }
}, {
  tableName: 'priorities',
  timestamps: false
});

module.exports = Priority;