<script setup>
import { onMounted, ref } from 'vue'
import { useCommissionStore } from '../stores/commissionStore'
import CommissionList from '../components/commissions/CommissionList.vue'

const commissionStore = useCommissionStore()
const isLoading = ref(false)
const searchQuery = ref('')

onMounted(async () => {
  isLoading.value = true
  await commissionStore.fetchCommissions()
  isLoading.value = false
})

const handleSearch = async () => {
  isLoading.value = true
  await commissionStore.searchCommissions(searchQuery.value)
  isLoading.value = false
}
</script>

<template>
  <div class="commission-list-view">
    <div class="header">
      <h1>Commission Management</h1>
    </div>

    <div class="search-bar">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search commissions..."
        @keyup.enter="handleSearch"
      />
      <button @click="handleSearch">Search</button>
    </div>

    <div v-if="isLoading" class="loading">
      Loading commissions...
    </div>
    <CommissionList v-else :commissions="commissionStore.commissions" />
  </div>
</template>

<style scoped>
.commission-list-view {
  padding: 1rem;
}

.header {
  margin-bottom: 1.5rem;
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
