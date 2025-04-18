import mongoose from 'mongoose'
import { logger } from '../middleware/logger.js'

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/teacher-recommendation'
const MAX_RETRIES = 3
const RETRY_DELAY = 5000 // 5 seconds

let connectionRetries = 0

export async function connectToMongo() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 10,
      minPoolSize: 2,
      socketTimeoutMS: 45000,
      family: 4
    })
    logger.info('Successfully connected to MongoDB')
  } catch (err) {
    connectionRetries++
    if (connectionRetries < MAX_RETRIES) {
      logger.warn(`MongoDB connection failed (attempt ${connectionRetries}/${MAX_RETRIES}). Retrying...`)
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY))
      return connectToMongo()
    }
    logger.fatal({err}, 'Failed to connect to MongoDB after multiple attempts')
    process.exit(1)
  }
}

export function getMongoConnection() {
  return mongoose.connection
}

export async function checkConnectionHealth() {
  try {
    await mongoose.connection.db.admin().ping()
    return true
  } catch (err) {
    logger.error({err}, 'MongoDB health check failed')
    return false
  }
}

// Event listeners
mongoose.connection.on('connected', () => {
  logger.info('Mongoose connected to DB')
})

mongoose.connection.on('error', (err) => {
  logger.error({err}, 'Mongoose connection error')
})

mongoose.connection.on('disconnected', () => {
  logger.warn('Mongoose disconnected from DB')
})

process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close()
    logger.info('Mongoose connection closed due to application termination')
    process.exit(0)
  } catch (err) {
    logger.error({err}, 'Error closing MongoDB connection')
    process.exit(1)
  }
})
