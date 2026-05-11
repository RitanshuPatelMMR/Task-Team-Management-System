const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Task = sequelize.define('Task', {
  title:       { type: DataTypes.STRING(200), allowNull: false },
  description: { type: DataTypes.TEXT },
  project_id:  { type: DataTypes.INTEGER,     allowNull: false },
  assigned_to: { type: DataTypes.INTEGER },
  created_by:  { type: DataTypes.INTEGER },
  status:      { type: DataTypes.ENUM('Todo','In Progress','Review','Completed'),
                 defaultValue: 'Todo' },
  priority:    { type: DataTypes.ENUM('Low','Medium','High'),
                 defaultValue: 'Medium' },
  due_date:    { type: DataTypes.DATEONLY },
}, { tableName: 'tasks', underscored: true });

module.exports = Task;
