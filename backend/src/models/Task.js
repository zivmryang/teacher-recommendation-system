import mongoose from 'mongoose'

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  type: {
    type: String,
    enum: ['TeacherFollowUp', 'SchoolFollowUp', 'Interview', 'Contract'],
    required: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  relatedTeacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher'
  },
  relatedSchool: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School'
  },
  relatedRecommendation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recommendation'
  },
  dueDate: Date,
  status: {
    type: String,
    enum: ['Pending', 'InProgress', 'Completed', 'Overdue'],
    default: 'Pending'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
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

taskSchema.pre('save', function(next) {
  this.updatedAt = Date.now()
  next()
})

export default mongoose.model('Task', taskSchema)
