import { defineStore } from 'pinia'

export const useTeacherStore = defineStore('teacher', {
  state: () => ({
    teachers: [],
    filters: {
      nationality: '',
      availableFrom: '',
      visaStatus: '',
      tags: []
    },
    currentPage: 1,
    totalPages: 1
  }),
  actions: {
    async fetchTeachers(params = {}) {
      try {
        const response = await teacherService.getTeachers({
          ...params,
          page: this.currentPage,
          limit: 10
        })
        this.teachers = response.data
        this.totalPages = response.pagination.pages
      } catch (error) {
        console.error('Failed to fetch teachers:', error)
        throw error
      }
    },
    async addTeacher(teacherData) {
      try {
        const newTeacher = await teacherService.createTeacher(teacherData)
        this.teachers.unshift(newTeacher)
        return newTeacher
      } catch (error) {
        console.error('Failed to add teacher:', error)
        throw error
      }
    },
    async updateTeacher(id, updates) {
      try {
        const updatedTeacher = await teacherService.updateTeacher(id, updates)
        const index = this.teachers.findIndex(t => t._id === id)
        if (index !== -1) {
          this.teachers.splice(index, 1, updatedTeacher)
        }
        return updatedTeacher
      } catch (error) {
        console.error('Failed to update teacher:', error)
        throw error
      }
    },
    async deleteTeacher(id) {
      try {
        await teacherService.deleteTeacher(id)
        this.teachers = this.teachers.filter(t => t._id !== id)
      } catch (error) {
        console.error('Failed to delete teacher:', error)
        throw error
      }
    },
    async uploadResume(id, file) {
      try {
        return await teacherService.uploadResume(id, file)
      } catch (error) {
        console.error('Failed to upload resume:', error)
        throw error
      }
    }
  },
  getters: {
    filteredTeachers() {
      return this.teachers.filter(teacher => {
        // Filter logic based on state.filters
        return true
      })
    }
  }
})
