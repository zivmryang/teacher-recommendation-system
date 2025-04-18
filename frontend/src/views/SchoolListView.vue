<script setup>
import { onMounted, ref } from 'vue'
import { useSchoolStore } from '../stores/schoolStore'
import SchoolList from '../components/schools/SchoolList.vue'

const schoolStore = useSchoolStore()
const isLoading = ref(false)
const searchQuery = ref('')

onMounted(async () => {
  isLoading.value = true
  await schoolStore.fetchSchools()
  isLoading.value = false
})

const handleSearch = async () => {
  isLoading.value = true
  await schoolStore.searchSchools(searchQuery.value)
  isLoading.value = false
}
</script>

<template>
  <div class="school-list-view">
    <div class="header">
      <h1>School Management</h1>
      <router-link to="/schools/new" class="new-button">
        Add New School
      </router-link>
    </div>

    <div class="search-bar">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search schools..."
        @keyup.enter="handleSearch"
      />
      <button @click="handleSearch">Search</button>
    </div>

    <div v-if="isLoading" class="loading">
      Loading schools...
    </div>
    <SchoolList v-else :schools="schoolStore.schools" />
  </div>
</template>

<style scoped>
.school-list-view {
  padding: 1rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.new-button {
  background-color: #1890ff;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  text-decoration: none;
}

.search-bar {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.search-bar input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.search-bar button {
  background-color: #1890ff;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.loading {
  text-align: center;
  padding: 2rem;
  color: #666;
}
</style>
