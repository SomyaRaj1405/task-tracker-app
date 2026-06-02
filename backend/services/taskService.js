const db = require('../config/db');

const taskService = {
  /**
   * Retrieves all tasks for a specific user, with optional filters
   * @param {number} userId - Owner ID
   * @param {string} status - Filter: 'completed', 'pending', or all
   * @param {string} search - Search matching title
   * @returns {Promise<Array>} Array of matching tasks
   */
  getAllTasks: async (userId, status, search) => {
    let sql = `SELECT * FROM tasks WHERE user_id = ?`;
    const params = [userId];

    if (status && (status === 'completed' || status === 'pending')) {
      sql += ` AND status = ?`;
      params.push(status);
    }

    if (search && search.trim() !== '') {
      sql += ` AND title LIKE ?`;
      params.push(`%${search.trim()}%`);
    }

    // Newest tasks first
    sql += ` ORDER BY created_at DESC`;

    return await db.all(sql, params);
  },

  /**
   * Creates a new task for the user
   * @param {number} userId 
   * @param {string} title 
   * @param {string} description 
   * @returns {Promise<object>} Created task object
   */
  createTask: async (userId, title, description) => {
    const sql = `
      INSERT INTO tasks (user_id, title, description)
      VALUES (?, ?, ?)
    `;
    const result = await db.run(sql, [userId, title, description]);
    
    // Fetch and return the newly created task
    return await taskService.findTaskById(result.lastID, userId);
  },

  /**
   * Finds a task by ID and owner
   * @param {number} taskId 
   * @param {number} userId 
   * @returns {Promise<object|null>} Task object or null
   */
  findTaskById: async (taskId, userId) => {
    const sql = `SELECT * FROM tasks WHERE id = ? AND user_id = ?`;
    const row = await db.get(sql, [taskId, userId]);
    return row || null;
  },

  /**
   * Updates fields on an existing task.
   * Uses COALESCE to dynamically update only the provided non-null values.
   */
  updateTask: async (taskId, userId, { title, description, status }) => {
    const sql = `
      UPDATE tasks 
      SET title = COALESCE(?, title),
          description = COALESCE(?, description),
          status = COALESCE(?, status),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND user_id = ?
    `;
    
    // Express undefined fields as null so SQLite uses COALESCE on them
    const params = [
      title !== undefined ? title : null,
      description !== undefined ? description : null,
      status !== undefined ? status : null,
      taskId,
      userId
    ];

    await db.run(sql, params);
    return await taskService.findTaskById(taskId, userId);
  },

  /**
   * Deletes a task
   * @param {number} taskId 
   * @param {number} userId 
   * @returns {Promise<boolean>} True if task deleted, false if not found
   */
  deleteTask: async (taskId, userId) => {
    const sql = `DELETE FROM tasks WHERE id = ? AND user_id = ?`;
    const result = await db.run(sql, [taskId, userId]);
    return result.changes > 0;
  },

  /**
   * Retrieves summary statistics for a user's dashboard
   * @param {number} userId 
   * @returns {Promise<object>} Dashboard metrics (total, completed, pending)
   */
  getDashboardStats: async (userId) => {
    const sql = `
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending
      FROM tasks 
      WHERE user_id = ?
    `;
    const row = await db.get(sql, [userId]);
    return {
      total: row.total || 0,
      completed: row.completed || 0,
      pending: row.pending || 0
    };
  }
};

module.exports = taskService;
