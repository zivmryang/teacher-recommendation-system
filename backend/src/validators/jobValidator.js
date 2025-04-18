import Joi from 'joi'

export const createJobSchema = Joi.object({
  job_code: Joi.string().pattern(/^zw\d{8}\d{4}$/).required(),
  school_id: Joi.string().hex().length(24).required(),
  school_type: Joi.string().required(),
  position: Joi.string().required(),
  location: Joi.string().required(),
  curriculum: Joi.string().required(),
  age_group: Joi.string().required(),
  work_schedule: Joi.string().required(),
  teaching_days: Joi.string().required(),
  class_size: Joi.number().integer().min(1).required(),
  salary_range: Joi.string().required(),
  accommodation: Joi.string().required(),
  vacation: Joi.string().required(),
  benefits: Joi.array().items(Joi.string()).required(),
  status: Joi.string().valid('Open', 'Filled', 'Closed').default('Open')
})

export const updateJobSchema = Joi.object({
  job_code: Joi.string().pattern(/^zw\d{8}\d{4}$/),
  school_id: Joi.string().hex().length(24),
  school_type: Joi.string(),
  position: Joi.string(),
  location: Joi.string(),
  curriculum: Joi.string(),
  age_group: Joi.string(),
  work_schedule: Joi.string(),
  teaching_days: Joi.string(),
  class_size: Joi.number().integer().min(1),
  salary_range: Joi.string(),
  accommodation: Joi.string(),
  vacation: Joi.string(),
  benefits: Joi.array().items(Joi.string()),
  status: Joi.string().valid('Open', 'Filled', 'Closed')
}).min(1)
