const { pool }    = require('../config/db');
const { Task, Project } = require('../models');

exports.getSummary = async (req, res) => {
  try {
    const totalProjects  = await Project.count();
    const totalTasks     = await Task.count();
    const completedTasks = await Task.count({ where: { status: 'Completed' } });
    const pendingTasks   = totalTasks - completedTasks;

    const overdueResult = await pool.query(
      `SELECT COUNT(*)::int as count FROM tasks
       WHERE due_date < CURRENT_DATE AND status != 'Completed'`
    );

    const byStatus = await pool.query(
      `SELECT status, COUNT(*)::int as count FROM tasks GROUP BY status ORDER BY status`
    );

    const byPriority = await pool.query(
      `SELECT priority, COUNT(*)::int as count FROM tasks GROUP BY priority ORDER BY priority`
    );

    res.json({
      totalProjects,
      totalTasks,
      completedTasks,
      pendingTasks,
      overdueTasks:    overdueResult.rows[0].count,
      tasksByStatus:   byStatus.rows,
      tasksByPriority: byPriority.rows,
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
};