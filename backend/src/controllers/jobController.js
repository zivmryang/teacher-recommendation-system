import Job from '../models/Job.js'
import { logger } from '../middleware/logger.js'
import { createJobSchema, updateJobSchema } from '../validators/jobValidator.js'

class JobError extends Error {
  constructor(message, status = 400) {
    super(message)
    this.status = status
    this.name = 'JobError'
  }
}

export async function createJob(ctx) {
  try {
    // Validate input
    const { error, value } = createJobSchema.validate(ctx.request.body)
    if (error) {
      throw new JobError(error.details[0].message)
    }

    const jobData = {
      ...value,
      createdBy: ctx.state.user.userId
    }

    logger.info({
      userId: ctx.state.user.userId,
      action: 'createJob',
      data: jobData
    }, 'Creating new job')

    const job = new Job(jobData)
    await job.save()

    logger.info({
      userId: ctx.state.user.userId,
      jobId: job._id,
      job_code: job.job_code
    }, 'Job created successfully')

    ctx.status = 201
    ctx.body = {
      success: true,
      data: job
    }
  } catch (err) {
    logger.error({
      userId: ctx.state.user.userId,
      error: err.message
    }, 'Failed to create job')

    ctx.status = err.status || 400
    ctx.body = {
      success: false,
      error: err.message
    }
  }
}

export async function getJobs(ctx) {
  try {
    const { page = 1, limit = 10, ...filters } = ctx.query

    logger.info({
      userId: ctx.state.user.userId,
      action: 'getJobs',
      filters
    }, 'Fetching jobs list')

    const skip = (page - 1) * limit
    const query = Job.find(filters)
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 })
      .populate('school_id')

    const jobs = await query.exec()
    const count = await Job.countDocuments(filters)

    logger.info({
      userId: ctx.state.user.userId,
      count: jobs.length
    }, 'Jobs fetched successfully')

    ctx.body = {
      success: true,
      data: jobs,
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
    }, 'Failed to fetch jobs')

    ctx.status = err.status || 400
    ctx.body = {
      success: false,
      error: err.message
    }
  }
}

export async function getJobById(ctx) {
  try {
    logger.info({
      userId: ctx.state.user.userId,
      action: 'getJob',
      jobId: ctx.params.id
    }, 'Fetching job details')

    const job = await Job.findById(ctx.params.id).populate('school_id')
    if (!job) {
      throw new JobError('Job not found', 404)
    }

    logger.info({
      userId: ctx.state.user.userId,
      jobId: job._id
    }, 'Job fetched successfully')

    ctx.body = {
      success: true,
      data: job
    }
  } catch (err) {
    logger.error({
      userId: ctx.state.user.userId,
      jobId: ctx.params.id,
      error: err.message
    }, 'Failed to fetch job')

    ctx.status = err.status || 400
    ctx.body = {
      success: false,
      error: err.message
    }
  }
}

export async function updateJob(ctx) {
  try {
    // Validate input
    const { error, value } = updateJobSchema.validate(ctx.request.body)
    if (error) {
      throw new JobError(error.details[0].message)
    }

    logger.info({
      userId: ctx.state.user.userId,
      action: 'updateJob',
      jobId: ctx.params.id,
      updates: value
    }, 'Updating job')

    const job = await Job.findByIdAndUpdate(
      ctx.params.id,
      value,
      { new: true, runValidators: true }
    ).populate('school_id')

    if (!job) {
      throw new JobError('Job not found', 404)
    }

    logger.info({
      userId: ctx.state.user.userId,
      jobId: job._id
    }, 'Job updated successfully')

    ctx.body = {
      success: true,
      data: job
    }
  } catch (err) {
    logger.error({
      userId: ctx.state.user.userId,
      jobId: ctx.params.id,
      error: err.message
    }, 'Failed to update job')

    ctx.status = err.status || 400
    ctx.body = {
      success: false,
      error: err.message
    }
  }
}

export async function deleteJob(ctx) {
  try {
    logger.info({
      userId: ctx.state.user.userId,
      action: 'deleteJob',
      jobId: ctx.params.id
    }, 'Deleting job')

    const job = await Job.findByIdAndDelete(ctx.params.id)
    if (!job) {
      throw new JobError('Job not found', 404)
    }

    logger.info({
      userId: ctx.state.user.userId,
      jobId: ctx.params.id
    }, 'Job deleted successfully')

    ctx.status = 204
  } catch (err) {
    logger.error({
      userId: ctx.state.user.userId,
      jobId: ctx.params.id,
      error: err.message
    }, 'Failed to delete job')

    ctx.status = err.status || 400
    ctx.body = {
      success: false,
      error: err.message
    }
  }
}
