const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Defect = sequelize.define('Defect', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.STRING },
  projectId: { type: DataTypes.INTEGER, allowNull: false },
  stageId: { type: DataTypes.INTEGER, allowNull: false },
  priorityId: { type: DataTypes.INTEGER, allowNull: false },
  executorId: { type: DataTypes.INTEGER, allowNull: false },
  deadline: { type: DataTypes.DATE },
  finishDate: { type: DataTypes.DATE }
}, {
  tableName: 'defects',
  timestamps: false
});

module.exports = Defect;