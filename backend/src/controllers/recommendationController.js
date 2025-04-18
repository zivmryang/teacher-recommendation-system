import Recommendation from '../models/Recommendation'
import Teacher from '../models/Teacher'
import School from '../models/School'
import { logger } from '../middleware/logger.js'
import { 
  createRecommendationSchema,
  updateStatusSchema,
  queryParamsSchema
} from '../validators/recommendationValidator.js'

const validStatusTransitions = {
  Recommended: ['Interviewing', 'Rejected'],
  Interviewing: ['Offered', 'Rejected'],
  Offered: ['Hired', 'Rejected'],
  Hired: [],
  Rejected: []
}

class RecommendationError extends Error {
  constructor(message, status = 400) {
    super(message)
    this.status = status
    this.name = 'RecommendationError'
  }
}

export async function createRecommendation(ctx) {
  try {
    // Validate input
    const { error, value } = createRecommendationSchema.validate(ctx.request.body)
    if (error) {
      throw new RecommendationError(error.details[0].message)
    }
    const { teacherId, schoolId, positionId } = value
    
    logger.info({
      userId: ctx.state.user.userId,
      action: 'createRecommendation',
      data: { teacherId, schoolId, positionId }
    }, 'Creating new recommendation')

    // Verify teacher and school exist
    const [teacher, school] = await Promise.all([
      Teacher.findById(teacherId),
      School.findById(schoolId)
    ])
    
    if (!teacher) {
      ctx.throw(404, 'Teacher not found')
    }
    if (!school) {
      ctx.throw(404, 'School not found')
    }
    
    // Get position details
    const position = school.jobPositions.id(positionId)
    if (!position) {
      ctx.throw(404, 'Position not found')
    }
    
    const recommendation = new Recommendation({
      teacher: teacherId,
      school: schoolId,
      position: position.position,
      assignedTo: ctx.state.user.userId,
      createdBy: ctx.state.user.userId,
      statusHistory: [{
        status: 'Recommended',
        changedBy: ctx.state.user.userId,
        notes: 'Initial recommendation'
      }]
    })
    
    await recommendation.save()
    
    ctx.status = 201
    ctx.body = recommendation
  } catch (err) {
    ctx.throw(400, err.message)
  }
}

export async function getRecommendations(ctx) {
  try {
    // Validate query params
    const { error, value } = queryParamsSchema.validate(ctx.query)
    if (error) {
      throw new RecommendationError(error.details[0].message)
    }
    const { page = 1, limit = 10, ...filters } = value
    
    logger.info({
      userId: ctx.state.user.userId,
      action: 'getRecommendations',
      filters
    }, 'Fetching recommendations')
    
    const skip = (page - 1) * limit
    const query = Recommendation.find(filters)
      .populate('teacher', 'name nationality')
      .populate('school', 'name city')
      .populate('assignedTo', 'name')
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 })
    
    const recommendations = await query.exec()
    const count = await Recommendation.countDocuments(filters)
    
    ctx.body = {
      data: recommendations,
      pagination: {
        total: count,
        page: Number(page),
        pages: Math.ceil(count / limit)
      }
    }
  } catch (err) {
    ctx.throw(400, err.message)
  }
}

export async function updateRecommendationStatus(ctx) {
  try {
    // Validate input
    const { error, value } = updateStatusSchema.validate(ctx.request.body)
    if (error) {
      throw new RecommendationError(error.details[0].message)
    }
    const { status, notes } = value
    
    // Get current recommendation
    const recommendation = await Recommendation.findById(ctx.params.id)
    if (!recommendation) {
      throw new RecommendationError('Recommendation not found', 404)
    }
    
    // Validate status transition
    const currentStatus = recommendation.status
    if (!validStatusTransitions[currentStatus]?.includes(status)) {
      throw new RecommendationError(
        `Invalid status transition from ${currentStatus} to ${status}`
      )
    }
    
    logger.info({
      userId: ctx.state.user.userId,
      action: 'updateStatus',
      recommendationId: ctx.params.id,
      fromStatus: currentStatus,
      toStatus: status
    }, 'Updating recommendation status')
    
    // Update recommendation
    const updated = await Recommendation.findByIdAndUpdate(
      ctx.params.id,
      { 
        $set: { status },
        $push: { 
          statusHistory: {
            status,
            changedBy: ctx.state.user.userId,
            notes
          }
        }
      },
      { new: true }
    )
    
    if (!updated) {
      throw new RecommendationError('Recommendation not found', 404)
    }
    
    logger.info({
      userId: ctx.state.user.userId,
      recommendationId: ctx.params.id,
      status: updated.status
    }, 'Recommendation status updated successfully')
    
    ctx.body = {
      success: true,
      data: updated
    }
  } catch (err) {
    ctx.throw(400, err.message)
  }
}

export async function getRecommendationById(ctx) {
  try {
    logger.info({
      userId: ctx.state.user.userId,
      action: 'getRecommendation',
      recommendationId: ctx.params.id
    }, 'Fetching recommendation details')

    const recommendation = await Recommendation.findById(ctx.params.id)
      .populate('teacher')
      .populate('school')
      .populate('assignedTo')
      .populate('createdBy')
    
    if (!recommendation) {
      throw new RecommendationError('Recommendation not found', 404)
    }
    
    ctx.body = {
      success: true,
      data: recommendation
    }
  } catch (err) {
    ctx.throw(400, err.message)
  }
}
