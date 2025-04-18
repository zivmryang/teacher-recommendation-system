import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export default {
  async createRecommendation(teacherId, schoolId, positionId) {
    const response = await axios.post(`${API_URL}/recommendations`, {
      teacherId,
      schoolId,
      positionId
    })
    return response.data
  },
  async getRecommendations(params = {}) {
    const response = await axios.get(`${API_URL}/recommendations`, { params })
    return response.data
  },
  async updateRecommendationStatus(id, status, notes) {
    const response = await axios.patch(`${API_URL}/recommendations/${id}/status`, {
      status,
      notes
    })
    return response.data
  },
  async getRecommendationById(id) {
    const response = await axios.get(`${API_URL}/recommendations/${id}`)
    return response.data
  }
}
