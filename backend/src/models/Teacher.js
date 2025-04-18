import mongoose from 'mongoose'

const teacherSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true
  },
  nationality: {
    type: String,
    required: true
  },
  education: {
    type: String,
    required: true
  },
  resumeUrl: String,
  expectedPosition: String,
  availableFrom: Date,
  visaStatus: {
    type: String,
    enum: ['Z-Visa', 'Work Permit', 'Residence Permit', 'Tourist Visa', 'None'],
    required: true
  },
  contact: {
    email: String,
    phone: String,
    wechat: String
  },
  tags: [String],
  preferred_positions: [
    {
      job_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
      status: { 
        type: String, 
        enum: ['待推荐', '已推荐', '已面试', '已签约', '放弃'],
        default: '待推荐'
      },
      comment: String,
      updated_by: String,
      updated_at: { type: Date, default: Date.now }
    }
  ],
  status: {
    type: String,
    enum: ['New', 'Recommended', 'Interview Scheduled', 'Offer Sent', 'Hired', 'Rejected'],
    default: 'New'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: Date
})

teacherSchema.pre('save', function(next) {
  this.updatedAt = Date.now()
  next()
})

export default mongoose.model('Teacher', teacherSchema)
