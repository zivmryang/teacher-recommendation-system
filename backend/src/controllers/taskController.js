import Task from '../models/Task'
import Teacher from '../models/Teacher'
import School from '../models/School'
import Recommendation from '../models/Recommendation'

export async function createTask(ctx) {
  try {
    const { 
      title,
      description,
      type,
      assignedTo,
      relatedTeacher,
      relatedSchool,
      relatedRecommendation,
      dueDate,
      priority
    } = ctx.request.body

    // Validate related entities exist if provided
    if (relatedTeacher) {
      const teacher = await Teacher.findById(relatedTeacher)
      if (!teacher) ctx.throw(404, 'Related teacher not found')
    }

    if (relatedSchool) {
      const school = await School.findById(relatedSchool)
      if (!school) ctx.throw(404, 'Related school not found')
    }

    if (relatedRecommendation) {
      const recommendation = await Recommendation.findById(relatedRecommendation)
      if (!recommendation) ctx.throw(404, 'Related recommendation not found')
    }

    const task = new Task({
      title,
      description,
      type,
      assignedTo,
      relatedTeacher,
      relatedSchool,
      relatedRecommendation,
      dueDate,
      priority,
      createdBy: ctx.state.user.userId
    })

    await task.save()

    ctx.status = 201
    ctx.body = task
  } catch (err) {
    ctx.throw(400, err.message)
  }
}

export async function getTasks(ctx) {
  try {
    const { page = 1, limit = 10, ...filters } = ctx.query
    const skip = (page - 1) * limit

    // Filter by assignedTo if not admin
    if (!ctx.state.user.isAdmin) {
      filters.assignedTo = ctx.state.user.userId
    }

    const query = Task.find(filters)
      .populate('assignedTo', 'name')
      .populate('relatedTeacher', 'name')
      .populate('relatedSchool', 'name')
      .populate('relatedRecommendation')
      .skip(skip)
      .limit(Number(limit))
      .sort({ dueDate: 1 })

    const tasks = await query.exec()
    const count = await Task.countDocuments(filters)

    ctx.body = {
      data: tasks,
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

export async function updateTaskStatus(ctx) {
  try {
    const { status } = ctx.request.body

    const task = await Task.findByIdAndUpdate(
      ctx.params.id,
      { status },
      { new: true }
    )

    if (!task) {
      ctx.throw(404, 'Task not found')
    }

    ctx.body = task
  } catch (err) {
    ctx.throw(400, err.message)
  }
}

export async function getTaskById(ctx) {
  try {
    const task = await Task.findById(ctx.params.id)
      .populate('assignedTo')
      .populate('relatedTeacher')
      .populate('relatedSchool')
      .populate('relatedRecommendation')
      .populate('createdBy')

    if (!task) {
      ctx.throw(404, 'Task not found')
    }

    ctx.body = task
  } catch (err) {
    ctx.throw(400, err.message)
  }
}
