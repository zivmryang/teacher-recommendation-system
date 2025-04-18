import Commission from '../models/Commission'
import Recommendation from '../models/Recommendation'

export async function createCommission(ctx) {
  try {
    const { 
      recommendationId,
      amount,
      currency,
      dueDate,
      notes
    } = ctx.request.body

    // Validate recommendation exists
    const recommendation = await Recommendation.findById(recommendationId)
    if (!recommendation) {
      ctx.throw(404, 'Recommendation not found')
    }

    const commission = new Commission({
      recommendation: recommendationId,
      amount,
      currency,
      dueDate,
      notes,
      createdBy: ctx.state.user.userId
    })

    await commission.save()

    // Update recommendation status to include commission
    recommendation.hasCommission = true
    await recommendation.save()

    ctx.status = 201
    ctx.body = commission
  } catch (err) {
    ctx.throw(400, err.message)
  }
}

export async function getCommissions(ctx) {
  try {
    const { page = 1, limit = 10, ...filters } = ctx.query
    const skip = (page - 1) * limit

    const query = Commission.find(filters)
      .populate('recommendation')
      .populate('createdBy', 'name')
      .skip(skip)
      .limit(Number(limit))
      .sort({ dueDate: 1 })

    const commissions = await query.exec()
    const count = await Commission.countDocuments(filters)

    ctx.body = {
      data: commissions,
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

export async function updateCommissionStatus(ctx) {
  try {
    const { status, paymentDate, invoiceNumber } = ctx.request.body

    const updateData = { status }
    if (paymentDate) updateData.paymentDate = paymentDate
    if (invoiceNumber) updateData.invoiceNumber = invoiceNumber

    const commission = await Commission.findByIdAndUpdate(
      ctx.params.id,
      updateData,
      { new: true }
    ).populate('recommendation')

    if (!commission) {
      ctx.throw(404, 'Commission not found')
    }

    ctx.body = commission
  } catch (err) {
    ctx.throw(400, err.message)
  }
}

export async function getCommissionById(ctx) {
  try {
    const commission = await Commission.findById(ctx.params.id)
      .populate('recommendation')
      .populate('createdBy')

    if (!commission) {
      ctx.throw(404, 'Commission not found')
    }

    ctx.body = commission
  } catch (err) {
    ctx.throw(400, err.message)
  }
}
