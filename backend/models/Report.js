const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Report = sequelize.define('Report', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  filter: { type: DataTypes.JSON },
  data: { type: DataTypes.JSON }
}, {
  tableName: 'reports',
  timestamps: false
});

module.exports = Report;