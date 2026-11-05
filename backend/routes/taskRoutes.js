const router = require('express').Router();
const {
  getTasks, getTask, createTask, updateTask, deleteTask, updateTaskStatus,
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect); // every task route needs a valid JWT

router.route('/').get(getTasks).post(authorize('Admin'), createTask);
router.route('/:id').get(getTask).put(authorize('Admin'), updateTask).delete(authorize('Admin'), deleteTask);
router.patch('/:id/status', updateTaskStatus);

module.exports = router;
