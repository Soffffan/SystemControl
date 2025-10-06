const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const History = sequelize.define('History', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  defectId: { type: DataTypes.INTEGER, allowNull: false },
  data: { type: DataTypes.JSON, allowNull: false }
}, {
  tableName: 'histories',
  timestamps: false
});

module.exports = History;