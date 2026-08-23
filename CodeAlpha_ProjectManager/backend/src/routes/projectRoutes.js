const express = require('express');
const router = express.Router();
const ProjectController = require('../controllers/projectController');
const { requireAuth } = require('../middleware/authMiddleware');

// All project routes require authentication
router.use(requireAuth);

router.post('/', ProjectController.createProject);
router.get('/', ProjectController.getProjects);
router.get('/:id', ProjectController.getProjectById);
router.put('/:id', ProjectController.updateProject);
router.delete('/:id', ProjectController.deleteProject);

// Project Member management
router.post('/:id/members', ProjectController.addMember);
router.delete('/:id/members/:userId', ProjectController.removeMember);

module.exports = router;
