import pino from 'pino'

// Create a Pino logger instance
const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  timestamp: () => `,"time":"${new Date().toISOString()}"`,
  formatters: {
    level(label) {
      return { level: label }
    }
  }
})

// Request logging middleware
export default function requestLogger() {
  return async (ctx, next) => {
    const start = Date.now()
    
    // Log the incoming request
    logger.info({
      req: {
        id: ctx.requestId,
        method: ctx.method,
        path: ctx.path,
        query: ctx.query,
        headers: ctx.headers
      },
      msg: 'Request received'
    })

    try {
      await next()
    } catch (err) {
      // Log any errors
      logger.error({
        req: {
          id: ctx.requestId,
          method: ctx.method,
          path: ctx.path
        },
        err,
        msg: 'Request failed'
      })
      throw err
    }

    const ms = Date.now() - start
    
    // Log the response
    logger.info({
      req: {
        id: ctx.requestId,
        method: ctx.method,
        path: ctx.path
      },
      res: {
        status: ctx.status,
        length: ctx.length
      },
      responseTime: ms,
      msg: 'Request completed'
    })
  }
}
