import Teacher from '../models/Teacher'

import { logger } from '../middleware/logger.js'
import { 
  createTeacherSchema,
  queryParamsSchema,
  updateTeacherSchema
} from '../validators/teacherValidator.js'
import { uploadResumeSchema } from '../validators/fileValidator.js'

class TeacherError extends Error {
  constructor(message, status = 400) {
    super(message)
    this.status = status
    this.name = 'TeacherError'
  }
}

export async function createTeacher(ctx) {
  try {
    // Validate input
    const { error, value } = createTeacherSchema.validate(ctx.request.body)
    if (error) {
      throw new TeacherError(error.details[0].message)
    }
    
    const teacherData = {
      ...value,
      createdBy: ctx.state.user.userId
    }
    
    logger.info({
      userId: ctx.state.user.userId,
      action: 'createTeacher',
      data: teacherData
    }, 'Creating new teacher')

    const teacher = new Teacher(teacherData)
    await teacher.save()
    
    logger.info({
      userId: ctx.state.user.userId,
      teacherId: teacher._id
    }, 'Teacher created successfully')
    
    ctx.status = 201
    ctx.body = {
      success: true,
      data: teacher
    }
  } catch (err) {
    logger.error({
      userId: ctx.state.user.userId,
      error: err.message
    }, 'Failed to create teacher')
    
    ctx.status = err.status || 400
    ctx.body = {
      success: false,
      error: err.message
    }
  }
}

export async function getTeachers(ctx) {
  try {
    // Validate query params
    const { error, value } = queryParamsSchema.validate(ctx.query)
    if (error) {
      throw new TeacherError(error.details[0].message)
    }
    const { page = 1, limit = 10, ...filters } = value
    
    logger.info({
      userId: ctx.state.user.userId,
      action: 'getTeachers',
      filters
    }, 'Fetching teachers list')

    const skip = (page - 1) * limit
    
    const query = Teacher.find(filters)
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 })
    
    const teachers = await query.exec()
    const count = await Teacher.countDocuments(filters)
    
    logger.info({
      userId: ctx.state.user.userId,
      count: teachers.length
    }, 'Teachers fetched successfully')
    
    ctx.body = {
      success: true,
      data: teachers,
      pagination: {
        total: count,
        page: Number(page),
        pages: Math.ceil(count / limit)
      }
    }
  } catch (err) {
    logger.error({
      userId: ctx.state.user.userId,
      error: err.message
    }, 'Failed to fetch teachers')
    
    ctx.status = err.status || 400
    ctx.body = {
      success: false,
      error: err.message
    }
  }
}

export async function getTeacherById(ctx) {
  try {
    logger.info({
      userId: ctx.state.user.userId,
      action: 'getTeacher',
      teacherId: ctx.params.id
    }, 'Fetching teacher details')

    const teacher = await Teacher.findById(ctx.params.id)
    if (!teacher) {
      throw new TeacherError('Teacher not found', 404)
    }
    
    logger.info({
      userId: ctx.state.user.userId,
      teacherId: teacher._id
    }, 'Teacher fetched successfully')
    
    ctx.body = {
      success: true,
      data: teacher
    }
  } catch (err) {
    logger.error({
      userId: ctx.state.user.userId,
      teacherId: ctx.params.id,
      error: err.message
    }, 'Failed to fetch teacher')
    
    ctx.status = err.status || 400
    ctx.body = {
      success: false,
      error: err.message
    }
  }
}

export async function updateTeacher(ctx) {
  try {
    // Validate input
    const { error, value } = updateTeacherSchema.validate(ctx.request.body)
    if (error) {
      throw new TeacherError(error.details[0].message)
    }
    
    logger.info({
      userId: ctx.state.user.userId,
      action: 'updateTeacher',
      teacherId: ctx.params.id,
      updates: value
    }, 'Updating teacher')

    const teacher = await Teacher.findByIdAndUpdate(
      ctx.params.id,
      value,
      { new: true, runValidators: true }
    )
    
    if (!teacher) {
      throw new TeacherError('Teacher not found', 404)
    }
    
    logger.info({
      userId: ctx.state.user.userId,
      teacherId: teacher._id
    }, 'Teacher updated successfully')
    
    ctx.body = {
      success: true,
      data: teacher
    }
  } catch (err) {
    logger.error({
      userId: ctx.state.user.userId,
      teacherId: ctx.params.id,
      error: err.message
    }, 'Failed to update teacher')
    
    ctx.status = err.status || 400
    ctx.body = {
      success: false,
      error: err.message
    }
  }
}

export async function deleteTeacher(ctx) {
  try {
    logger.info({
      userId: ctx.state.user.userId,
      action: 'deleteTeacher',
      teacherId: ctx.params.id
    }, 'Deleting teacher')

    const teacher = await Teacher.findByIdAndDelete(ctx.params.id)
    if (!teacher) {
      throw new TeacherError('Teacher not found', 404)
    }
    
    logger.info({
      userId: ctx.state.user.userId,
      teacherId: ctx.params.id
    }, 'Teacher deleted successfully')
    
    ctx.status = 204
  } catch (err) {
    logger.error({
      userId: ctx.state.user.userId,
      teacherId: ctx.params.id,
      error: err.message
    }, 'Failed to delete teacher')
    
    ctx.status = err.status || 400
    ctx.body = {
      success: false,
      error: err.message
    }
  }
}

import fs from 'fs/promises'
import path from 'path'

const UPLOAD_DIR = process.env.UPLOAD_DIR || './uploads'

export async function uploadResume(ctx) {
  let tempFilePath = null
  try {
    // Validate file
    const { error } = uploadResumeSchema.validate({ resume: ctx.request.files?.resume })
    if (error) {
      throw new TeacherError(error.details[0].message)
    }
    
    const file = ctx.request.files.resume
    tempFilePath = file.path
    
    logger.info({
      userId: ctx.state.user.userId,
      action: 'uploadResume',
      teacherId: ctx.params.id,
      file: {
        name: file.name,
        size: file.size,
        type: file.type
      }
    }, 'Uploading resume')

    // Ensure upload directory exists
    await fs.mkdir(UPLOAD_DIR, { recursive: true })

    // Generate secure filename
    const ext = path.extname(file.name)
    const filename = `${ctx.params.id}_${Date.now()}_resume${ext}`
    const filePath = path.join(UPLOAD_DIR, filename)

    // Move uploaded file
    await fs.rename(tempFilePath, filePath)
    tempFilePath = null // Clear after successful move

    // Update teacher record with resume URL
    const teacher = await Teacher.findByIdAndUpdate(
      ctx.params.id,
      { resumeUrl: `/uploads/${filename}` },
      { new: true }
    )

    if (!teacher) {
      throw new TeacherError('Teacher not found', 404)
    }

    logger.info({
      userId: ctx.state.user.userId,
      teacherId: teacher._id,
      resumeUrl: teacher.resumeUrl
    }, 'Resume uploaded successfully')

    ctx.body = {
      success: true,
      data: teacher
    }
  } catch (err) {
    // Clean up temp file if exists
    if (tempFilePath) {
      try {
        await fs.unlink(tempFilePath)
      } catch (cleanupErr) {
        logger.error({
          userId: ctx.state.user.userId,
          error: cleanupErr.message
        }, 'Failed to clean up temporary file')
      }
    }

    logger.error({
      userId: ctx.state.user.userId,
      teacherId: ctx.params.id,
      error: err.message
    }, 'Failed to upload resume')

    ctx.status = err.status || 400
    ctx.body = {
      success: false,
      error: err.message
    }
  }
}
