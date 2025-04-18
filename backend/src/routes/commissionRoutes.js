import Router from 'koa-router'
import {
  createCommission,
  getCommissions,
  updateCommissionStatus,
  getCommissionById
} from '../controllers/commissionController'
import { authenticate } from '../middleware/wecomAuth'

const router = new Router({ prefix: '/api/commissions' })

router.use(authenticate)

router.post('/', createCommission)
router.get('/', getCommissions)
router.get('/:id', getCommissionById)
router.patch('/:id/status', updateCommissionStatus)

export default router
