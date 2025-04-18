import Router from 'koa-router'
import * as teacherController from '../controllers/teacherController'
import { wecomAuth } from '../middleware/wecomAuth'

const router = new Router({ prefix: '/api/teachers' })

// Apply WeCom auth to all routes
router.use(wecomAuth)

router.post('/', teacherController.createTeacher)
router.get('/', teacherController.getTeachers)
router.get('/:id', teacherController.getTeacherById)
router.patch('/:id', teacherController.updateTeacher)
router.delete('/:id', teacherController.deleteTeacher)
router.post('/:id/resume', teacherController.uploadResume)

export default router
