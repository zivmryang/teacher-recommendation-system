<script setup>
import { onMounted, ref } from 'vue'
import { useTeacherStore } from '../stores/teacherStore'
import TeacherList from '../components/teachers/TeacherList.vue'

const teacherStore = useTeacherStore()
const isLoading = ref(false)
const searchQuery = ref('')

onMounted(async () => {
  isLoading.value = true
  await teacherStore.fetchTeachers()
  isLoading.value = false
})

const handleSearch = async () => {
  isLoading.value = true
  await teacherStore.searchTeachers(searchQuery.value)
  isLoading.value = false
}
</script>

<template>
  <div class="teacher-list-view">
    <div class="header">
      <h1>Teacher Management</h1>
      <router-link to="/teachers/new" class="new-button">
        Add New Teacher
      </router-link>
    </div>

    <div class="search-bar">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search teachers..."
        @keyup.enter="handleSearch"
      />
      <button @click="handleSearch">Search</button>
    </div>

    <div v-if="isLoading" class="loading">
      Loading teachers...
    </div>
    <TeacherList v-else :teachers="teacherStore.teachers" />
  </div>
</template>

<style scoped>
.teacher-list-view {
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
