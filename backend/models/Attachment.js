const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Attachment = sequelize.define('Attachment', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  defectId: { type: DataTypes.INTEGER, allowNull: false },
  photoUrl: { type: DataTypes.STRING, allowNull: false }
}, {
  tableName: 'attachments',
  timestamps: false
});

module.exports = Attachment;