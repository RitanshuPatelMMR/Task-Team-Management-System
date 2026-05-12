const { TaskComment, User, Task } = require('../models');

exports.getAll = async (req, res) => {
  try {
    const comments = await TaskComment.findAll({
      where: { task_id: req.params.taskId },
      include: [{ model: User, as: 'author', attributes: ['id','name'] }],
      order: [['created_at','ASC']],
    });
    res.json(comments);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.create = async (req, res) => {
  try {
    const { comment } = req.body;
    if (!comment) return res.status(400).json({ message: 'comment text required' });

    const task = await Task.findByPk(req.params.taskId);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const newComment = await TaskComment.create({
      task_id: req.params.taskId,
      user_id: req.user.id,
      comment,
    });
    res.status(201).json(newComment);
  } catch (err) { res.status(500).json({ message: err.message }); }
};