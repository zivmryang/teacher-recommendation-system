import { defineStore } from 'pinia'
import recommendationService from '../api/recommendationService'
import { notifyRecommendationUpdate } from '../services/notificationService'

export const useRecommendationStore = defineStore('recommendation', {
  state: () => ({
    recommendations: [],
    filters: {
      status: '',
      assignedTo: ''
    },
    currentPage: 1,
    totalPages: 1
  }),
  actions: {
    async fetchRecommendations(params = {}) {
      try {
        const response = await recommendationService.getRecommendations({
          ...params,
          page: this.currentPage,
          limit: 10
        })
        this.recommendations = response.data
        this.totalPages = response.pagination.pages
      } catch (error) {
        console.error('Failed to fetch recommendations:', error)
        throw error
      }
    },
    async createRecommendation(teacherId, schoolId, positionId) {
      try {
        const newRecommendation = await recommendationService.createRecommendation(
          teacherId,
          schoolId,
          positionId
        )
        this.recommendations.unshift(newRecommendation)
        await notifyRecommendationUpdate(newRecommendation)
        return newRecommendation
      } catch (error) {
        console.error('Failed to create recommendation:', error)
        throw error
      }
    },
    async updateStatus(id, status, notes) {
      try {
        const updated = await recommendationService.updateRecommendationStatus(id, status, notes)
        const index = this.recommendations.findIndex(r => r._id === id)
        if (index !== -1) {
          this.recommendations.splice(index, 1, updated)
        }
        await notifyRecommendationUpdate(updated)
        return updated
      } catch (error) {
        console.error('Failed to update recommendation status:', error)
        throw error
      }
    }
  },
  getters: {
    filteredRecommendations() {
      return this.recommendations.filter(rec => {
        if (this.filters.status && rec.status !== this.filters.status) return false
        if (this.filters.assignedTo && rec.assignedTo._id !== this.filters.assignedTo) return false
        return true
      })
    }
  }
})
