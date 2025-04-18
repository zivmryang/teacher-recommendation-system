import { sendWeComNotification } from '../utils/wecom'
import { useAuthStore } from '../stores/authStore'

export const NotificationType = {
  RECOMMENDATION_CREATED: 'RECOMMENDATION_CREATED',
  RECOMMENDATION_UPDATED: 'RECOMMENDATION_UPDATED',
  INTERVIEW_SCHEDULED: 'INTERVIEW_SCHEDULED',
  OFFER_SENT: 'OFFER_SENT',
  CONTRACT_SIGNED: 'CONTRACT_SIGNED',
  TASK_ASSIGNED: 'TASK_ASSIGNED'
}

const notificationTemplates = {
  [NotificationType.RECOMMENDATION_CREATED]: (data) => 
    `New recommendation: ${data.teacherName} for ${data.schoolName}`,
  [NotificationType.RECOMMENDATION_UPDATED]: (data) =>
    `Recommendation update: ${data.teacherName} status changed to ${data.status}`,
  [NotificationType.INTERVIEW_SCHEDULED]: (data) =>
    `Interview scheduled: ${data.teacherName} with ${data.schoolName} on ${data.date}`,
  [NotificationType.OFFER_SENT]: (data) =>
    `Offer sent: ${data.teacherName} for ${data.position} at ${data.schoolName}`,
  [NotificationType.CONTRACT_SIGNED]: (data) =>
    `Contract signed: ${data.teacherName} with ${data.schoolName}`,
  [NotificationType.TASK_ASSIGNED]: (data) =>
    `New task assigned: ${data.taskType} for ${data.targetName}`
}

export const sendNotification = async (type, data, userId = null) => {
  try {
    const authStore = useAuthStore()
    const targetUserId = userId || authStore.user?.userId
    
    if (!targetUserId) {
      console.error('No user ID provided for notification')
      return false
    }

    const message = notificationTemplates[type](data)
    await sendWeComNotification(targetUserId, message)
    return true
  } catch (error) {
    console.error('Failed to send notification:', error)
    return false
  }
}

export const notifyRecommendationUpdate = async (recommendation) => {
  const data = {
    teacherName: recommendation.teacher.name,
    schoolName: recommendation.school.name,
    status: recommendation.status
  }
  return sendNotification(
    NotificationType.RECOMMENDATION_UPDATED, 
    data,
    recommendation.assignedTo
  )
}

export const notifyTaskAssignment = async (task) => {
  const data = {
    taskType: task.type,
    targetName: task.target.name
  }
  return sendNotification(
    NotificationType.TASK_ASSIGNED,
    data,
    task.assignedTo
  )
}
