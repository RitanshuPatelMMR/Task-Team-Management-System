const { pool }    = require('../config/db');
const { Task, Project, ProjectMember } = require('../models');

exports.getSummary = async (req, res) => {
  try {
    const isDeveloper = req.user.role === 'Developer';
    const uid = req.user.id;

    let totalProjects, totalTasks, completedTasks, overdueResult, byStatus, byPriority;

    if (isDeveloper) {
      // Only projects this developer is a member of
      totalProjects = await ProjectMember.count({ where: { user_id: uid } });

      totalTasks     = await Task.count({ where: { assigned_to: uid } });
      completedTasks = await Task.count({ where: { assigned_to: uid, status: 'Completed' } });

      overdueResult = await pool.query(
        `SELECT COUNT(*)::int as count FROM tasks
         WHERE assigned_to = $1 AND due_date < CURRENT_DATE AND status != 'Completed'`,
        [uid]
      );
      byStatus = await pool.query(
        `SELECT status, COUNT(*)::int as count FROM tasks
         WHERE assigned_to = $1 GROUP BY status ORDER BY status`,
        [uid]
      );
      byPriority = await pool.query(
        `SELECT priority, COUNT(*)::int as count FROM tasks
         WHERE assigned_to = $1 GROUP BY priority ORDER BY priority`,
        [uid]
      );
    } else {
      totalProjects  = await Project.count();
      totalTasks     = await Task.count();
      completedTasks = await Task.count({ where: { status: 'Completed' } });

      overdueResult = await pool.query(
        `SELECT COUNT(*)::int as count FROM tasks
         WHERE due_date < CURRENT_DATE AND status != 'Completed'`
      );
      byStatus = await pool.query(
        `SELECT status, COUNT(*)::int as count FROM tasks GROUP BY status ORDER BY status`
      );
      byPriority = await pool.query(
        `SELECT priority, COUNT(*)::int as count FROM tasks GROUP BY priority ORDER BY priority`
      );
    }

    res.json({
      totalProjects,
      totalTasks,
      completedTasks,
      pendingTasks:    totalTasks - completedTasks,
      overdueTasks:    overdueResult.rows[0].count,
      tasksByStatus:   byStatus.rows,
      tasksByPriority: byPriority.rows,
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
};