import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export default {
  async getTeachers(params = {}) {
    const response = await axios.get(`${API_URL}/teachers`, { params })
    return response.data
  },
  async createTeacher(teacherData) {
    const response = await axios.post(`${API_URL}/teachers`, teacherData)
    return response.data
  },
  async updateTeacher(id, updates) {
    const response = await axios.patch(`${API_URL}/teachers/${id}`, updates)
    return response.data
  },
  async deleteTeacher(id) {
    await axios.delete(`${API_URL}/teachers/${id}`)
  },
  async uploadResume(id, file) {
    const formData = new FormData()
    formData.append('resume', file)
    const response = await axios.post(`${API_URL}/teachers/${id}/resume`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  }
}
