import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export default {
  async createTask(taskData) {
    const response = await axios.post(`${API_URL}/tasks`, taskData)
    return response.data
  },
  async getTasks(params = {}) {
    const response = await axios.get(`${API_URL}/tasks`, { params })
    return response.data
  },
  async updateTaskStatus(id, status) {
    const response = await axios.patch(`${API_URL}/tasks/${id}/status`, { status })
    return response.data
  },
  async getTaskById(id) {
    const response = await axios.get(`${API_URL}/tasks/${id}`)
    return response.data
  }
}
