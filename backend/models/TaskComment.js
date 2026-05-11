const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const TaskComment = sequelize.define('TaskComment', {
  task_id: { type: DataTypes.INTEGER, allowNull: false },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  comment: { type: DataTypes.TEXT,    allowNull: false },
}, { tableName: 'task_comments', underscored: true, updatedAt: false });

module.exports = TaskComment;
