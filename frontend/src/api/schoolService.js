import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export default {
  async getSchools(params = {}) {
    const response = await axios.get(`${API_URL}/schools`, { params })
    return response.data
  },
  async createSchool(schoolData) {
    const response = await axios.post(`${API_URL}/schools`, schoolData)
    return response.data
  },
  async updateSchool(id, updates) {
    const response = await axios.patch(`${API_URL}/schools/${id}`, updates)
    return response.data
  },
  async deleteSchool(id) {
    await axios.delete(`${API_URL}/schools/${id}`)
  },
  async addJobPosition(schoolId, positionData) {
    const response = await axios.post(`${API_URL}/schools/${schoolId}/positions`, positionData)
    return response.data
  },
  async updateJobPosition(schoolId, positionId, updates) {
    const response = await axios.patch(
      `${API_URL}/schools/${schoolId}/positions/${positionId}`,
      updates
    )
    return response.data
  }
}
