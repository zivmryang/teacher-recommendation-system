import Koa from 'koa'
import Router from 'koa-router'
import cors from '@koa/cors'
import koaBody from 'koa-body'
import helmet from 'koa-helmet'
import ratelimit from 'koa-ratelimit'
import { connectToMongo } from './db/mongo'
import { authenticate } from './middleware/wecomAuth'
import logger from './middleware/logger'
import teacherRouter from './routes/teacherRoutes'
import schoolRouter from './routes/schoolRoutes'
import recommendationRouter from './routes/recommendationRoutes'
import taskRouter from './routes/taskRoutes'
import commissionRouter from './routes/commissionRoutes'
import jobRouter from './routes/jobRoutes'

const app = new Koa()
const router = new Router()

// Initialize MongoDB connection
connectToMongo()

// Security headers
app.use(helmet())

// Rate limiting
app.use(ratelimit({
  driver: 'memory',
  db: new Map(),
  duration: 60000,
  errorMessage: 'Too many requests',
  id: (ctx) => ctx.ip,
  headers: {
    remaining: 'Rate-Limit-Remaining',
    reset: 'Rate-Limit-Reset',
    total: 'Rate-Limit-Total'
  },
  max: 100,
  disableHeader: false
}))

// Request logging
app.use(logger())

// Add request ID and response time headers
app.use(async (ctx, next) => {
  ctx.requestId = Math.random().toString(36).substring(2, 15)
  const start = Date.now()
  await next()
  const ms = Date.now() - start
  ctx.set('X-Response-Time', `${ms}ms`)
  ctx.set('X-Request-ID', ctx.requestId)
})

// Apply authentication middleware
app.use(authenticate)

// API routes
app.use(teacherRouter.routes())
app.use(schoolRouter.routes())
app.use(recommendationRouter.routes())
app.use(taskRouter.routes())
app.use(commissionRouter.routes())
app.use(jobRouter.routes())

// Middleware
app.use(cors())
app.use(koaBody({
  multipart: true,
  formidable: {
    uploadDir: process.env.UPLOAD_DIR || './uploads',
    keepExtensions: true
  }
}))

// Health check endpoint
router.get('/health', (ctx) => {
  ctx.body = { status: 'ok' }
})

// Apply routes
app.use(router.routes())
app.use(router.allowedMethods())

// Error handling
app.on('error', (err, ctx) => {
  console.error(`[${ctx.requestId}] Server error:`, err)
  ctx.status = err.status || 500
  ctx.body = { 
    error: err.message || 'Internal server error',
    requestId: ctx.requestId,
    timestamp: new Date().toISOString()
  }
})

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...')
  server.close(() => {
    console.log('Server closed')
    process.exit(0)
  })
})

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...')
  server.close(() => {
    console.log('Server closed')
    process.exit(0)
  })
})

const PORT = process.env.PORT || 3000
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

// Export server for testing
export default server
