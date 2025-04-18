import Router from 'koa-router'
import {
  createTask,
  getTasks,
  updateTaskStatus,
  getTaskById
} from '../controllers/taskController'
import { authenticate } from '../middleware/wecomAuth'

const router = new Router({ prefix: '/api/tasks' })

router.use(authenticate)

router.post('/', createTask)
router.get('/', getTasks)
router.get('/:id', getTaskById)
router.patch('/:id/status', updateTaskStatus)

export default router
