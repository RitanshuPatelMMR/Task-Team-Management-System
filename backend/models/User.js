const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const User = sequelize.define('User', {
  name:      { type: DataTypes.STRING(100),  allowNull: false },
  email:     { type: DataTypes.STRING(150),  allowNull: false, unique: true,
               validate: { isEmail: true } },
  password:  { type: DataTypes.TEXT,         allowNull: false },
  role:      { type: DataTypes.ENUM('Admin','Manager','Developer'),
               defaultValue: 'Developer' },
  is_active: { type: DataTypes.BOOLEAN,      defaultValue: true },
}, { tableName: 'users', underscored: true });

module.exports = User;
