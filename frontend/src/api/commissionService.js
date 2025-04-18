import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export default {
  async createCommission(commissionData) {
    const response = await axios.post(`${API_URL}/commissions`, commissionData)
    return response.data
  },
  async getCommissions(params = {}) {
    const response = await axios.get(`${API_URL}/commissions`, { params })
    return response.data
  },
  async updateCommissionStatus(id, statusData) {
    const response = await axios.patch(`${API_URL}/commissions/${id}/status`, statusData)
    return response.data
  },
  async getCommissionById(id) {
    const response = await axios.get(`${API_URL}/commissions/${id}`)
    return response.data
  }
}
