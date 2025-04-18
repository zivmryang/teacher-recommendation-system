<script setup>
import { ref, onMounted } from 'vue'
import { useSchoolStore } from '../../stores/schoolStore'
import SchoolForm from './SchoolForm.vue'

const schoolStore = useSchoolStore()
const isLoading = ref(false)
const showForm = ref(false)
const currentSchool = ref(null)

onMounted(async () => {
  isLoading.value = true
  await schoolStore.fetchSchools()
  isLoading.value = false
})

const handleEdit = (school) => {
  currentSchool.value = { ...school }
  showForm.value = true
}

const handleCreate = () => {
  currentSchool.value = null
  showForm.value = true
}

const handleFormSubmit = async () => {
  showForm.value = false
  await schoolStore.fetchSchools()
}

const handleFormCancel = () => {
  showForm.value = false
}
</script>

<template>
  <div class="school-list">
    <h2>School Management</h2>
    
    <div v-if="isLoading">Loading schools...</div>
    
    <div v-else>
      <div class="actions">
        <button @click="handleCreate">Add New School</button>
      </div>

      <SchoolForm 
        v-if="showForm"
        :school="currentSchool"
        @submit="handleFormSubmit"
        @cancel="handleFormCancel"
      />

      <div v-else>
        <div class="filters">
          <!-- TODO: Add filter controls -->
        </div>
        
        <table class="school-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>City</th>
              <th>Type</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="school in schoolStore.filteredSchools" :key="school._id">
              <td>{{ school.name }}</td>
              <td>{{ school.city }}</td>
              <td>{{ school.schoolType }}</td>
              <td>{{ school.status }}</td>
              <td>
                <button @click="handleEdit(school)">Edit</button>
              </td>
            </tr>
          </tbody>
        </table>
        
        <div class="pagination">
          <!-- TODO: Add pagination controls -->
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.school-table {
  width: 100%;
  border-collapse: collapse;
}

.school-table th, .school-table td {
  padding: 8px;
  border: 1px solid #ddd;
  text-align: left;
}

.school-table tr:nth-child(even) {
  background-color: #f2f2f2;
}
</style>
