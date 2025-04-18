<script setup>
import { ref, onMounted } from 'vue'
import { useRecommendationStore } from '../../stores/recommendationStore'
import RecommendationStatus from './RecommendationStatus.vue'

const recommendationStore = useRecommendationStore()
const isLoading = ref(false)

onMounted(async () => {
  isLoading.value = true
  await recommendationStore.fetchRecommendations()
  isLoading.value = false
})

const updateStatus = async (id, status, notes) => {
  await recommendationStore.updateStatus(id, status, notes)
}
</script>

<template>
  <div class="recommendation-list">
    <h2>Recommendations</h2>
    
    <div v-if="isLoading">Loading recommendations...</div>
    
    <div v-else>
      <div class="filters">
        <select v-model="recommendationStore.filters.status">
          <option value="">All Statuses</option>
          <option value="Recommended">Recommended</option>
          <option value="Pending">Pending</option>
          <option value="Interview Scheduled">Interview Scheduled</option>
          <option value="Offer Sent">Offer Sent</option>
          <option value="Hired">Hired</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>
      
      <table class="recommendation-table">
        <thead>
          <tr>
            <th>Teacher</th>
            <th>School</th>
            <th>Position</th>
            <th>Status</th>
            <th>Assigned To</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="rec in recommendationStore.filteredRecommendations" :key="rec._id">
            <td>{{ rec.teacher?.name }}</td>
            <td>{{ rec.school?.name }}</td>
            <td>{{ rec.position }}</td>
            <td>
              <RecommendationStatus 
                :status="rec.status"
                @update="(status, notes) => updateStatus(rec._id, status, notes)"
              />
            </td>
            <td>{{ rec.assignedTo?.name }}</td>
            <td>
              <button @click="$router.push(`/recommendations/${rec._id}`)">
                View Details
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      
      <div class="pagination">
        <button 
          @click="recommendationStore.currentPage--; recommendationStore.fetchRecommendations()"
          :disabled="recommendationStore.currentPage <= 1"
        >
          Previous
        </button>
        <span>Page {{ recommendationStore.currentPage }} of {{ recommendationStore.totalPages }}</span>
        <button 
          @click="recommendationStore.currentPage++; recommendationStore.fetchRecommendations()"
          :disabled="recommendationStore.currentPage >= recommendationStore.totalPages"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.recommendation-table {
  width: 100%;
  border-collapse: collapse;
}

.recommendation-table th, .recommendation-table td {
  padding: 8px;
  border: 1px solid #ddd;
  text-align: left;
}

.recommendation-table tr:nth-child(even) {
  background-color: #f2f2f2;
}

.pagination {
  margin-top: 1rem;
  display: flex;
  gap: 1rem;
  align-items: center;
}
</style>
