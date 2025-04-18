import { defineStore } from 'pinia'
import authService from '../api/authService'
import router from '../router'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    isLoading: false,
    error: null
  }),
  actions: {
    async login(code) {
      try {
        this.isLoading = true
        this.error = null
        
        // For testing, allow both WeCom login and manual test login
        let response;
        if (code) {
          response = await authService.loginWithWeCom(code)
        } else {
          // Test user data
          response = {
            token: 'test-token-123',
            user: {
              userId: 'test-user',
              name: 'Test User',
              department: ['admin']
            }
          }
        }
        
        authService.storeToken(response.token)
        this.user = response.user
        
        router.push('/dashboard')
      } catch (error) {
        this.error = error.response?.data?.error || 'Login failed'
        throw error
      } finally {
        this.isLoading = false
      }
    },
    
    async checkAuth() {
      try {
        this.isLoading = true
        const user = await authService.getUserInfo()
        this.user = user
        return !!user
      } catch (error) {
        this.logout()
        return false
      } finally {
        this.isLoading = false
      }
    },
    
    logout() {
      authService.removeToken()
      this.user = null
      router.push('/login')
    }
  },
  getters: {
    isAuthenticated: (state) => !!state.user,
    isAdmin: (state) => state.user?.department?.includes('admin')
  }
})
