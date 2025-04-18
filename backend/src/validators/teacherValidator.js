import Joi from 'joi'

export const createTeacherSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().pattern(/^[0-9]{10,15}$/).required(),
  nationality: Joi.string().required(),
  qualifications: Joi.array().items(Joi.string()).required(),
  experienceYears: Joi.number().min(0).required(),
  subjects: Joi.array().items(Joi.string()).required(),
  resumeUrl: Joi.string().uri().optional()
})

export const updateTeacherSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string().email(),
  phone: Joi.string().pattern(/^[0-9]{10,15}$/),
  nationality: Joi.string(),
  qualifications: Joi.array().items(Joi.string()),
  experienceYears: Joi.number().min(0),
  subjects: Joi.array().items(Joi.string()),
  resumeUrl: Joi.string().uri()
}).min(1)

export const queryParamsSchema = Joi.object({
  page: Joi.number().min(1).default(1),
  limit: Joi.number().min(1).max(100).default(10),
  nationality: Joi.string(),
  subjects: Joi.array().items(Joi.string()),
  minExperience: Joi.number().min(0)
})
