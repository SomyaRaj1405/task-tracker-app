const taskService = require('../services/taskService');

const taskController = {
  /**
   * Retrieves all tasks for the authenticated user, optionally filtered
   * GET /tasks
   */
  getAllTasks: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { status, search } = req.query;

      const tasks = await taskService.getAllTasks(userId, status, search);

      res.status(200).json({
        status: 'success',
        results: tasks.length,
        data: { tasks }
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Retrieves dashboard aggregation metrics
   * GET /tasks/stats
   */
  getDashboardStats: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const stats = await taskService.getDashboardStats(userId);

      res.status(200).json({
        status: 'success',
        data: { stats }
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Retrieves a specific task by ID
   * GET /tasks/:id
   */
  getTaskById: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const taskId = parseInt(req.params.id, 10);

      if (isNaN(taskId)) {
        return res.status(400).json({ status: 'error', message: 'Invalid task ID format.' });
      }

      const task = await taskService.findTaskById(taskId, userId);

      if (!task) {
        return res.status(404).json({ status: 'error', message: 'Task not found or unauthorized.' });
      }

      res.status(200).json({
        status: 'success',
        data: { task }
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Creates a new task
   * POST /tasks
   */
  createTask: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { title, description } = req.body;

      // Validate title
      if (!title || !title.trim()) {
        return res.status(400).json({ status: 'error', message: 'Task title is required.' });
      }

      const newTask = await taskService.createTask(userId, title.trim(), description ? description.trim() : '');

      res.status(201).json({
        status: 'success',
        message: 'Task created successfully.',
        data: { task: newTask }
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Updates an existing task (partial updates supported)
   * PATCH /tasks/:id
   */
  updateTask: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const taskId = parseInt(req.params.id, 10);
      const { title, description, status } = req.body;

      if (isNaN(taskId)) {
        return res.status(400).json({ status: 'error', message: 'Invalid task ID format.' });
      }

      // Check if task exists and belongs to the user
      const existingTask = await taskService.findTaskById(taskId, userId);
      if (!existingTask) {
        return res.status(404).json({ status: 'error', message: 'Task not found or unauthorized.' });
      }

      // Validate status if provided
      if (status && status !== 'pending' && status !== 'completed') {
        return res.status(400).json({
          status: 'error',
          message: "Invalid status value. Must be 'pending' or 'completed'."
        });
      }

      // Validate title if provided as empty
      if (title !== undefined && (!title || !title.trim())) {
        return res.status(400).json({ status: 'error', message: 'Task title cannot be empty.' });
      }

      const updatedTask = await taskService.updateTask(taskId, userId, {
        title: title !== undefined ? title.trim() : undefined,
        description: description !== undefined ? description.trim() : undefined,
        status
      });

      res.status(200).json({
        status: 'success',
        message: 'Task updated successfully.',
        data: { task: updatedTask }
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Deletes a task
   * DELETE /tasks/:id
   */
  deleteTask: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const taskId = parseInt(req.params.id, 10);

      if (isNaN(taskId)) {
        return res.status(400).json({ status: 'error', message: 'Invalid task ID format.' });
      }

      const success = await taskService.deleteTask(taskId, userId);

      if (!success) {
        return res.status(404).json({ status: 'error', message: 'Task not found or unauthorized.' });
      }

      res.status(200).json({
        status: 'success',
        message: 'Task deleted successfully.'
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = taskController;
