<script setup>
import { onMounted, ref } from 'vue'
import { useRecommendationStore } from '../stores/recommendationStore'
import RecommendationList from '../components/recommendations/RecommendationList.vue'

const recommendationStore = useRecommendationStore()
const isLoading = ref(false)
const searchQuery = ref('')

onMounted(async () => {
  isLoading.value = true
  await recommendationStore.fetchRecommendations()
  isLoading.value = false
})

const handleSearch = async () => {
  isLoading.value = true
  await recommendationStore.searchRecommendations(searchQuery.value)
  isLoading.value = false
}
</script>

<template>
  <div class="recommendation-list-view">
    <div class="header">
      <h1>Recommendation Management</h1>
      <router-link to="/recommendations/new" class="new-button">
        Create New Recommendation
      </router-link>
    </div>

    <div class="search-bar">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search recommendations..."
        @keyup.enter="handleSearch"
      />
      <button @click="handleSearch">Search</button>
    </div>

    <div v-if="isLoading" class="loading">
      Loading recommendations...
    </div>
    <RecommendationList v-else :recommendations="recommendationStore.recommendations" />
  </div>
</template>

<style scoped>
.recommendation-list-view {
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
