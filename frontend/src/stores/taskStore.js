import { defineStore } from 'pinia'
import taskService from '../api/taskService'

export const useTaskStore = defineStore('task', {
  state: () => ({
    tasks: [],
    filters: {
      status: '',
      priority: '',
      type: ''
    },
    currentPage: 1,
    totalPages: 1
  }),
  actions: {
    async fetchTasks(params = {}) {
      try {
        const response = await taskService.getTasks({
          ...params,
          page: this.currentPage,
          limit: 10
        })
        this.tasks = response.data
        this.totalPages = response.pagination.pages
      } catch (error) {
        console.error('Failed to fetch tasks:', error)
        throw error
      }
    },
    async createTask(taskData) {
      try {
        const newTask = await taskService.createTask(taskData)
        this.tasks.unshift(newTask)
        return newTask
      } catch (error) {
        console.error('Failed to create task:', error)
        throw error
      }
    },
    async updateTaskStatus(id, status) {
      try {
        const updated = await taskService.updateTaskStatus(id, status)
        const index = this.tasks.findIndex(t => t._id === id)
        if (index !== -1) {
          this.tasks.splice(index, 1, updated)
        }
        return updated
      } catch (error) {
        console.error('Failed to update task status:', error)
        throw error
      }
    }
  },
  getters: {
    filteredTasks() {
      return this.tasks.filter(task => {
        if (this.filters.status && task.status !== this.filters.status) return false
        if (this.filters.priority && task.priority !== this.filters.priority) return false
        if (this.filters.type && task.type !== this.filters.type) return false
        return true
      })
    },
    overdueTasks() {
      return this.tasks.filter(task => 
        task.status !== 'Completed' && 
        task.dueDate && 
        new Date(task.dueDate) < new Date()
      )
    }
  }
})
