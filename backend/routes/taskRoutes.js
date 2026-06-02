const express = require('express');
const taskController = require('../controllers/taskController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Secure all task endpoints with JWT protection middleware
router.use(authMiddleware);

// Task CRUD and Aggregate endpoints
router.get('/', taskController.getAllTasks);
router.get('/stats', taskController.getDashboardStats);
router.get('/:id', taskController.getTaskById);
router.post('/', taskController.createTask);
router.patch('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

module.exports = router;
