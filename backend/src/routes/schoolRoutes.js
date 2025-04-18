import Router from 'koa-router'
import {
  createSchool,
  getSchools,
  getSchoolById,
  updateSchool,
  deleteSchool,
  addJobPosition,
  updateJobPosition
} from '../controllers/schoolController'
import { authenticate } from '../middleware/wecomAuth'

const router = new Router({ prefix: '/api/schools' })

router.use(authenticate)

router.post('/', createSchool)
router.get('/', getSchools)
router.get('/:id', getSchoolById)
router.patch('/:id', updateSchool)
router.delete('/:id', deleteSchool)

// Job position routes
router.post('/:id/positions', addJobPosition)
router.patch('/:schoolId/positions/:positionId', updateJobPosition)

export default router
