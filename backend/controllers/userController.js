const bcrypt   = require('bcryptjs');
const { User } = require('../models');
const { Op }   = require('sequelize');

exports.getAll = async (req, res) => {
  try {
    const page   = parseInt(req.query.page)  || 1;
    const limit  = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search;

    const where = search
      ? { [Op.or]: [
          { name:  { [Op.iLike]: `%${search}%` } },
          { email: { [Op.iLike]: `%${search}%` } },
        ]}
      : {};

    const { rows, count } = await User.findAndCountAll({
      where,
      attributes: { exclude: ['password'] },
      limit, offset,
      order: [['created_at', 'DESC']],
    });
    res.json({ data: rows, total: count, page, totalPages: Math.ceil(count / limit) });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.create = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: 'name, email, password required' });

    const hashed = await bcrypt.hash(password, 10);
    const user   = await User.create({ name, email, password: hashed, role: role || 'Developer' });
    const { password: _, ...userOut } = user.toJSON();
    res.status(201).json(userOut);
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError')
      return res.status(400).json({ message: 'Email already exists' });
    res.status(500).json({ message: err.message });
  }
};

exports.updateRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!['Admin','Manager','Developer'].includes(role))
      return res.status(400).json({ message: 'Invalid role' });
    await User.update({ role }, { where: { id: req.params.id } });
    res.json({ message: 'Role updated' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.updateStatus = async (req, res) => {
  try {
    const { is_active } = req.body;
    await User.update({ is_active }, { where: { id: req.params.id } });
    res.json({ message: `User ${is_active ? 'activated' : 'deactivated'}` });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
exports.remove = async (req, res) => {
  try {
    if (parseInt(req.params.id) === req.user.id)
      return res.status(400).json({ message: 'Cannot delete your own account' });

    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // ADD THIS LINE ↓
    await require('../models').Task.update({ assigned_to: null }, { where: { assigned_to: req.params.id } });

    await user.destroy();
    res.json({ message: 'User deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};