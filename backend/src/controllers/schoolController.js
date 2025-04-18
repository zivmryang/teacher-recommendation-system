import School from '../models/School'

export async function createSchool(ctx) {
  try {
    const schoolData = ctx.request.body
    schoolData.createdBy = ctx.state.user.userId
    
    const school = new School(schoolData)
    await school.save()
    
    ctx.status = 201
    ctx.body = school
  } catch (err) {
    ctx.throw(400, err.message)
  }
}

export async function getSchools(ctx) {
  try {
    const { page = 1, limit = 10, ...filters } = ctx.query
    const skip = (page - 1) * limit
    
    const query = School.find(filters)
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 })
    
    const schools = await query.exec()
    const count = await School.countDocuments(filters)
    
    ctx.body = {
      data: schools,
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

export async function getSchoolById(ctx) {
  try {
    const school = await School.findById(ctx.params.id)
    if (!school) {
      ctx.throw(404, 'School not found')
    }
    ctx.body = school
  } catch (err) {
    ctx.throw(400, err.message)
  }
}

export async function updateSchool(ctx) {
  try {
    const school = await School.findByIdAndUpdate(
      ctx.params.id,
      ctx.request.body,
      { new: true, runValidators: true }
    )
    if (!school) {
      ctx.throw(404, 'School not found')
    }
    ctx.body = school
  } catch (err) {
    ctx.throw(400, err.message)
  }
}

export async function deleteSchool(ctx) {
  try {
    const school = await School.findByIdAndDelete(ctx.params.id)
    if (!school) {
      ctx.throw(404, 'School not found')
    }
    ctx.status = 204
  } catch (err) {
    ctx.throw(400, err.message)
  }
}

export async function addJobPosition(ctx) {
  try {
    const school = await School.findByIdAndUpdate(
      ctx.params.id,
      { $push: { jobPositions: ctx.request.body } },
      { new: true }
    )
    if (!school) {
      ctx.throw(404, 'School not found')
    }
    ctx.body = school
  } catch (err) {
    ctx.throw(400, err.message)
  }
}

export async function updateJobPosition(ctx) {
  try {
    const { schoolId, positionId } = ctx.params
    const school = await School.findOneAndUpdate(
      { _id: schoolId, 'jobPositions._id': positionId },
      { $set: { 'jobPositions.$': ctx.request.body } },
      { new: true }
    )
    if (!school) {
      ctx.throw(404, 'School or position not found')
    }
    ctx.body = school
  } catch (err) {
    ctx.throw(400, err.message)
  }
}
