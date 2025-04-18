<script setup>
import { ref, onMounted } from 'vue'
import { useTaskStore } from '../../stores/taskStore'
import TaskStatusBadge from './TaskStatusBadge.vue'

const taskStore = useTaskStore()
const isLoading = ref(false)

onMounted(async () => {
  isLoading.value = true
  await taskStore.fetchTasks()
  isLoading.value = false
})

const updateStatus = async (id, status) => {
  await taskStore.updateTaskStatus(id, status)
}
</script>

<template>
  <div class="task-list">
    <h2>Tasks</h2>
    
    <div v-if="isLoading">Loading tasks...</div>
    
    <div v-else>
      <div class="filters">
        <select v-model="taskStore.filters.status">
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="InProgress">In Progress</option>
          <option value="Completed">Completed</option>
          <option value="Overdue">Overdue</option>
        </select>
        
        <select v-model="taskStore.filters.priority">
          <option value="">All Priorities</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        
        <select v-model="taskStore.filters.type">
          <option value="">All Types</option>
          <option value="TeacherFollowUp">Teacher Follow-up</option>
          <option value="SchoolFollowUp">School Follow-up</option>
          <option value="Interview">Interview</option>
          <option value="Contract">Contract</option>
        </select>
      </div>
      
      <table class="task-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Type</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Due Date</th>
            <th>Related To</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="task in taskStore.filteredTasks" :key="task._id">
            <td>{{ task.title }}</td>
            <td>{{ task.type }}</td>
            <td>{{ task.priority }}</td>
            <td>
              <TaskStatusBadge 
                :status="task.status"
                @update="status => updateStatus(task._id, status)"
              />
            </td>
            <td>{{ task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-' }}</td>
            <td>
              <span v-if="task.relatedTeacher">Teacher: {{ task.relatedTeacher?.name }}</span>
              <span v-if="task.relatedSchool">School: {{ task.relatedSchool?.name }}</span>
            </td>
            <td>
              <button @click="$router.push(`/tasks/${task._id}`)">
                View Details
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      
      <div class="pagination">
        <button 
          @click="taskStore.currentPage--; taskStore.fetchTasks()"
          :disabled="taskStore.currentPage <= 1"
        >
          Previous
        </button>
        <span>Page {{ taskStore.currentPage }} of {{ taskStore.totalPages }}</span>
        <button 
          @click="taskStore.currentPage++; taskStore.fetchTasks()"
          :disabled="taskStore.currentPage >= taskStore.totalPages"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.task-table {
  width: 100%;
  border-collapse: collapse;
}

.task-table th, .task-table td {
  padding: 8px;
  border: 1px solid #ddd;
  text-align: left;
}

.task-table tr:nth-child(even) {
  background-color: #f2f2f2;
}

.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.pagination {
  margin-top: 1rem;
  display: flex;
  gap: 1rem;
  align-items: center;
}
</style>
