import { defineStore } from 'pinia'
import commissionService from '../api/commissionService'

export const useCommissionStore = defineStore('commission', {
  state: () => ({
    commissions: [],
    filters: {
      status: '',
      dateRange: null
    },
    currentPage: 1,
    totalPages: 1,
    stats: {
      total: 0,
      pending: 0,
      paid: 0,
      overdue: 0
    }
  }),
  actions: {
    async fetchCommissions(params = {}) {
      try {
        const response = await commissionService.getCommissions({
          ...params,
          page: this.currentPage,
          limit: 10
        })
        this.commissions = response.data
        this.totalPages = response.pagination.pages
      } catch (error) {
        console.error('Failed to fetch commissions:', error)
        throw error
      }
    },
    async createCommission(commissionData) {
      try {
        const newCommission = await commissionService.createCommission(commissionData)
        this.commissions.unshift(newCommission)
        return newCommission
      } catch (error) {
        console.error('Failed to create commission:', error)
        throw error
      }
    },
    async updateCommissionStatus(id, statusData) {
      try {
        const updated = await commissionService.updateCommissionStatus(id, statusData)
        const index = this.commissions.findIndex(c => c._id === id)
        if (index !== -1) {
          this.commissions.splice(index, 1, updated)
        }
        return updated
      } catch (error) {
        console.error('Failed to update commission status:', error)
        throw error
      }
    },
    async loadStats() {
      try {
        const response = await commissionService.getCommissions({ stats: true })
        this.stats = response.stats
      } catch (error) {
        console.error('Failed to load commission stats:', error)
      }
    }
  },
  getters: {
    filteredCommissions() {
      return this.commissions.filter(commission => {
        if (this.filters.status && commission.status !== this.filters.status) return false
        if (this.filters.dateRange) {
          const [start, end] = this.filters.dateRange
          const paymentDate = new Date(commission.paymentDate || commission.dueDate)
          return paymentDate >= new Date(start) && paymentDate <= new Date(end)
        }
        return true
      })
    },
    pendingCommissions() {
      return this.commissions.filter(c => c.status === 'Pending')
    }
  }
})
