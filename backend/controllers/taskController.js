const { Task, User, Project } = require('../models');
const { Op } = require('sequelize');

exports.getAll = async (req, res) => {
  try {
    const page   = parseInt(req.query.page)  || 1;
    const limit  = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const { project_id, status, priority, assigned_to } = req.query;

    const where = {};
    if (project_id)  where.project_id  = project_id;
    if (status)      where.status      = status;
    if (priority)    where.priority    = priority;
    if (assigned_to) where.assigned_to = assigned_to;

    if (req.user.role === 'Developer') where.assigned_to = req.user.id;

    const { rows, count } = await Task.findAndCountAll({
      where, limit, offset,
      include: [
        { model: User, as: 'assignee', attributes: ['id','name','email'] },
        { model: User, as: 'creator',  attributes: ['id','name'] },
      ],
      order: [['created_at','DESC']],
    });
    res.json({ data: rows, total: count, page, totalPages: Math.ceil(count / limit) });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getOne = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id, {
      include: [
        { model: User, as: 'assignee', attributes: ['id','name','email'] },
        { model: User, as: 'creator',  attributes: ['id','name'] },
        { model: Project, attributes: ['id','name'] },
      ],
    });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.create = async (req, res) => {
  try {
    const { title, description, project_id, assigned_to, priority, due_date } = req.body;
    if (!title || !project_id)
      return res.status(400).json({ message: 'title and project_id required' });

    const task = await Task.create({
      title, description, project_id, assigned_to,
      priority, due_date, created_by: req.user.id,
    });
    res.status(201).json(task);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.update = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    if (req.user.role === 'Developer') {
      if (task.assigned_to !== req.user.id)
        return res.status(403).json({ message: 'Can only update your own tasks' });
      const { status } = req.body;
      if (!status) return res.status(400).json({ message: 'Developer can only update status' });
      await task.update({ status });
    } else {
      await task.update(req.body);
    }
    res.json(task);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.remove = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    await task.destroy();
    res.json({ message: 'Task deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};