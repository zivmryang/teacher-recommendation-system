import Router from 'koa-router'
import {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob
} from '../controllers/jobController.js'
import { wecomAuth } from '../middleware/wecomAuth.js'

const router = new Router({ prefix: '/jobs' })

router.post('/', wecomAuth, createJob)
router.get('/', wecomAuth, getJobs)
router.get('/:id', wecomAuth, getJobById)
router.patch('/:id', wecomAuth, updateJob)
router.delete('/:id', wecomAuth, deleteJob)

export default router
