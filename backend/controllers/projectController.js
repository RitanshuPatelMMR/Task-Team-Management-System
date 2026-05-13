const { Project, User, ProjectMember } = require('../models');
const { Op } = require('sequelize');

exports.getAll = async (req, res) => {
  try {
    const page   = parseInt(req.query.page)  || 1;
    const limit  = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const { search, status } = req.query;

    const where = {};
    if (search) where.name = { [Op.iLike]: `%${search}%` };
    if (status) where.status = status;

    // Developer: only projects they are a member of
    if (req.user.role === 'Developer') {
      const memberships = await ProjectMember.findAll({ where: { user_id: req.user.id }, attributes: ['project_id'] });
      const ids = memberships.map(m => m.project_id);
      where.id = ids.length ? ids : [-1]; // -1 returns nothing if no memberships
    }

    const { rows, count } = await Project.findAndCountAll({
      where, limit, offset,
      include: [{ model: User, as: 'members', attributes: ['id','name','email','role'], through: { attributes: [] } }],
      order: [['created_at', 'DESC']],
    });
    res.json({ data: rows, total: count, page, totalPages: Math.ceil(count / limit) });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getOne = async (req, res) => {
  try {
    // Developer: only if member of this project
    if (req.user.role === 'Developer') {
      const member = await ProjectMember.findOne({
        where: { project_id: req.params.id, user_id: req.user.id }
      });
      if (!member) return res.status(403).json({ message: 'Access denied' });
    }

    const project = await Project.findByPk(req.params.id, {
      include: [{ model: User, as: 'members', attributes: ['id','name','email','role'], through: { attributes: [] } }],
    });
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.create = async (req, res) => {
  try {
    const { name, description, start_date, end_date, status } = req.body;
    if (!name) return res.status(400).json({ message: 'Project name required' });
    const project = await Project.create({ name, description, start_date, end_date, status, created_by: req.user.id });
    res.status(201).json(project);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.update = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    await project.update(req.body);
    res.json(project);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.remove = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    await project.destroy();
    res.json({ message: 'Project deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.assignMembers = async (req, res) => {
  try {
    const { user_ids } = req.body;
    if (!Array.isArray(user_ids) || !user_ids.length)
      return res.status(400).json({ message: 'user_ids array required' });

    const project = await Project.findByPk(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    await ProjectMember.destroy({ where: { project_id: req.params.id } });
    const records = user_ids.map(uid => ({ project_id: parseInt(req.params.id), user_id: uid }));
    await ProjectMember.bulkCreate(records, { ignoreDuplicates: true });

    res.json({ message: 'Members assigned' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
