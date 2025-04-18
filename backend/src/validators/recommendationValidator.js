import Joi from 'joi'

export const createRecommendationSchema = Joi.object({
  teacherId: Joi.string().hex().length(24).required(),
  schoolId: Joi.string().hex().length(24).required(),
  positionId: Joi.string().hex().length(24).required()
})

export const updateStatusSchema = Joi.object({
  status: Joi.string().valid(
    'Recommended',
    'Interviewing',
    'Offered',
    'Hired',
    'Rejected'
  ).required(),
  notes: Joi.string().max(500).required()
})

export const queryParamsSchema = Joi.object({
  page: Joi.number().min(1).default(1),
  limit: Joi.number().min(1).max(100).default(10),
  status: Joi.string().valid(
    'Recommended',
    'Interviewing',
    'Offered',
    'Hired',
    'Rejected'
  ),
  teacher: Joi.string().hex().length(24),
  school: Joi.string().hex().length(24)
})
