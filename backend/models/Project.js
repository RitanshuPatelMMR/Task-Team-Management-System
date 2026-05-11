const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Project = sequelize.define('Project', {
  name:        { type: DataTypes.STRING(200), allowNull: false },
  description: { type: DataTypes.TEXT },
  start_date:  { type: DataTypes.DATEONLY },
  end_date:    { type: DataTypes.DATEONLY },
  status:      { type: DataTypes.ENUM('Planned','Active','Completed','On Hold'),
                 defaultValue: 'Planned' },
  created_by:  { type: DataTypes.INTEGER },
}, { tableName: 'projects', underscored: true });

module.exports = Project;
