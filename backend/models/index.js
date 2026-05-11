const { sequelize } = require('../config/db');
const User          = require('./User');
const Project       = require('./Project');
const ProjectMember = require('./ProjectMember');
const Task          = require('./Task');
const TaskComment   = require('./TaskComment');

User.belongsToMany(Project, { through: ProjectMember, foreignKey: 'user_id' });
Project.belongsToMany(User, { through: ProjectMember, foreignKey: 'project_id', as: 'members' });

Project.hasMany(Task, { foreignKey: 'project_id', onDelete: 'CASCADE' });
Task.belongsTo(Project, { foreignKey: 'project_id' });

User.hasMany(Task, { foreignKey: 'created_by', as: 'createdTasks' });
User.hasMany(Task, { foreignKey: 'assigned_to', as: 'assignedTasks' });
Task.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });
Task.belongsTo(User, { foreignKey: 'assigned_to', as: 'assignee' });

Task.hasMany(TaskComment, { foreignKey: 'task_id', onDelete: 'CASCADE' });
TaskComment.belongsTo(Task, { foreignKey: 'task_id' });
TaskComment.belongsTo(User, { foreignKey: 'user_id', as: 'author' });

module.exports = { sequelize, User, Project, ProjectMember, Task, TaskComment };
