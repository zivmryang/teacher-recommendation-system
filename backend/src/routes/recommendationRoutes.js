import Router from 'koa-router'
import {
  createRecommendation,
  getRecommendations,
  updateRecommendationStatus,
  getRecommendationById
} from '../controllers/recommendationController'
import { authenticate } from '../middleware/wecomAuth'

const router = new Router({ prefix: '/api/recommendations' })

router.use(authenticate)

router.post('/', createRecommendation)
router.get('/', getRecommendations)
router.get('/:id', getRecommendationById)
router.patch('/:id/status', updateRecommendationStatus)

export default router
