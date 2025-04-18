<script setup>
import { ref, onMounted } from 'vue'
import { useTeacherStore } from '../../stores/teacherStore'
import TeacherForm from './TeacherForm.vue'

const teacherStore = useTeacherStore()
const isLoading = ref(false)
const showForm = ref(false)
const currentTeacher = ref(null)

onMounted(async () => {
  isLoading.value = true
  await teacherStore.fetchTeachers()
  isLoading.value = false
})

const handleEdit = (teacher) => {
  currentTeacher.value = { ...teacher }
  showForm.value = true
}

const handleCreate = () => {
  currentTeacher.value = null
  showForm.value = true
}

const handleFormSubmit = async () => {
  showForm.value = false
  await teacherStore.fetchTeachers()
}

const handleFormCancel = () => {
  showForm.value = false
}
</script>

<template>
  <div class="teacher-list">
    <h2>Teacher Management</h2>
    
    <div v-if="isLoading">Loading teachers...</div>
    
    <div v-else>
      <div class="actions">
        <button @click="handleCreate">Add New Teacher</button>
      </div>

      <TeacherForm 
        v-if="showForm"
        :teacher="currentTeacher"
        @submit="handleFormSubmit"
        @cancel="handleFormCancel"
      />

      <div v-else>
        <div class="filters">
          <!-- TODO: Add filter controls -->
        </div>
      </div>
      
      <table class="teacher-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Nationality</th>
            <th>Visa Status</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="teacher in teacherStore.filteredTeachers" :key="teacher._id">
            <td>{{ teacher.name }}</td>
            <td>{{ teacher.nationality }}</td>
            <td>{{ teacher.visaStatus }}</td>
            <td>{{ teacher.status }}</td>
            <td>
              <button @click="handleEdit(teacher)">Edit</button>
            </td>
          </tr>
        </tbody>
      </table>
      
      <div class="pagination">
        <!-- TODO: Add pagination controls -->
      </div>
    </div>
  </div>
</template>

<style scoped>
.teacher-table {
  width: 100%;
  border-collapse: collapse;
}

.teacher-table th, .teacher-table td {
  padding: 8px;
  border: 1px solid #ddd;
  text-align: left;
}

.teacher-table tr:nth-child(even) {
  background-color: #f2f2f2;
}
</style>
