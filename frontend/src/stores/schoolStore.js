import { defineStore } from 'pinia'
import schoolService from '../api/schoolService'

export const useSchoolStore = defineStore('school', {
  state: () => ({
    schools: [],
    filters: {
      city: '',
      schoolType: '',
      status: ''
    },
    currentPage: 1,
    totalPages: 1
  }),
  actions: {
    async fetchSchools(params = {}) {
      try {
        const response = await schoolService.getSchools({
          ...params,
          page: this.currentPage,
          limit: 10
        })
        this.schools = response.data
        this.totalPages = response.pagination.pages
      } catch (error) {
        console.error('Failed to fetch schools:', error)
        throw error
      }
    },
    async createSchool(schoolData) {
      try {
        const newSchool = await schoolService.createSchool(schoolData)
        this.schools.unshift(newSchool)
        return newSchool
      } catch (error) {
        console.error('Failed to create school:', error)
        throw error
      }
    },
    async updateSchool(id, updates) {
      try {
        const updatedSchool = await schoolService.updateSchool(id, updates)
        const index = this.schools.findIndex(s => s._id === id)
        if (index !== -1) {
          this.schools.splice(index, 1, updatedSchool)
        }
        return updatedSchool
      } catch (error) {
        console.error('Failed to update school:', error)
        throw error
      }
    },
    async deleteSchool(id) {
      try {
        await schoolService.deleteSchool(id)
        this.schools = this.schools.filter(s => s._id !== id)
      } catch (error) {
        console.error('Failed to delete school:', error)
        throw error
      }
    },
    async addJobPosition(schoolId, positionData) {
      try {
        const school = await schoolService.addJobPosition(schoolId, positionData)
        const index = this.schools.findIndex(s => s._id === schoolId)
        if (index !== -1) {
          this.schools.splice(index, 1, school)
        }
        return school
      } catch (error) {
        console.error('Failed to add job position:', error)
        throw error
      }
    },
    async updateJobPosition(schoolId, positionId, updates) {
      try {
        const school = await schoolService.updateJobPosition(schoolId, positionId, updates)
        const index = this.schools.findIndex(s => s._id === schoolId)
        if (index !== -1) {
          this.schools.splice(index, 1, school)
        }
        return school
      } catch (error) {
        console.error('Failed to update job position:', error)
        throw error
      }
    }
  },
  getters: {
    filteredSchools() {
      return this.schools.filter(school => {
        // Filter logic based on state.filters
        return true
      })
    }
  }
})
