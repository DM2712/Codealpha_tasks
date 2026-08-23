const express = require('express');
const router = express.Router();
const TaskController = require('../controllers/taskController');
const { requireAuth } = require('../middleware/authMiddleware');

router.use(requireAuth);

router.post('/', TaskController.createTask);
router.get('/project/:projectId', TaskController.getProjectTasks);
router.get('/:id', TaskController.getTaskById);
router.put('/:id', TaskController.updateTask);
router.delete('/:id', TaskController.deleteTask);

module.exports = router;
