import mongoose from 'mongoose'

const schoolSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  contactName: {
    type: String,
    required: true
  },
  contactPhone: String,
  contactWechat: String,
  contactEmail: String,
  schoolType: {
    type: String,
    enum: ['International', 'Bilingual', 'Public', 'Training Center'],
    required: true
  },
  jobPositions: [{
    position: String,
    startDate: Date,
    salaryRange: String,
    requirements: String,
    status: {
      type: String,
      enum: ['Open', 'Filled', 'Closed'],
      default: 'Open'
    }
  }],
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Blacklisted'],
    default: 'Active'
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

schoolSchema.pre('save', function(next) {
  this.updatedAt = Date.now()
  next()
})

export default mongoose.model('School', schoolSchema)
