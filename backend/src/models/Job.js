import mongoose from 'mongoose'

const JobSchema = new mongoose.Schema({
  job_code: {
    type: String,
    required: true,
    unique: true
  },
  school_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true
  },
  school_type: String,
  position: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  curriculum: String,
  age_group: String,
  work_schedule: String,
  teaching_days: String,
  class_size: Number,
  salary_range: String,
  accommodation: String,
  vacation: String,
  benefits: [String],
  status: {
    type: String,
    enum: ['Open', 'Filled', 'Closed'],
    default: 'Open'
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

JobSchema.pre('save', function(next) {
  this.updatedAt = Date.now()
  next()
})

export default mongoose.model('Job', JobSchema)
