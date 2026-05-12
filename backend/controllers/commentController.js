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
// PUT /api/tasks/:taskId/comments/:id
exports.update = async (req, res) => {
  try {
    const { comment } = req.body;
    if (!comment) return res.status(400).json({ message: 'comment text required' });

    const existing = await TaskComment.findByPk(req.params.id);
    if (!existing) return res.status(404).json({ message: 'Comment not found' });
    if (existing.user_id !== req.user.id)
      return res.status(403).json({ message: 'Can only edit your own comments' });

    await existing.update({ comment });
    res.json(existing);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// DELETE /api/tasks/:taskId/comments/:id
exports.remove = async (req, res) => {
  try {
    const existing = await TaskComment.findByPk(req.params.id);
    if (!existing) return res.status(404).json({ message: 'Comment not found' });
    if (existing.user_id !== req.user.id && !['Admin','Manager'].includes(req.user.role))
      return res.status(403).json({ message: 'Not allowed' });

    await existing.destroy();
    res.json({ message: 'Comment deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};