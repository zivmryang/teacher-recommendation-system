import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export default {
  async loginWithWeCom(code) {
    try {
      const response = await axios.get(`${API_URL}/auth/wecom`, {
        params: { code }
      })
      return response.data
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  },

  storeToken(token) {
    localStorage.setItem('authToken', token)
  },

  getToken() {
    return localStorage.getItem('authToken')
  },

  removeToken() {
    localStorage.removeItem('authToken')
  },

  isAuthenticated() {
    return !!this.getToken()
  },

  async getUserInfo() {
    try {
      const token = this.getToken()
      if (!token) return null
      
      const response = await axios.get(`${API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      return response.data
    } catch (error) {
      console.error('Failed to get user info:', error)
      this.removeToken()
      return null
    }
  }
}
