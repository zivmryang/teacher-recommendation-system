import Joi from 'joi'

export const uploadResumeSchema = Joi.object({
  resume: Joi.object({
    name: Joi.string().pattern(/\.(pdf|docx?)$/i).required(),
    size: Joi.number().max(5 * 1024 * 1024).required(), // 5MB max
    mimetype: Joi.string().valid(
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ).required()
  }).unknown(true).required()
})
