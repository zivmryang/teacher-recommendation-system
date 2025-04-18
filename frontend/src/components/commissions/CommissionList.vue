<script setup>
import { ref, onMounted } from 'vue'
import { useCommissionStore } from '../../stores/commissionStore'
import CommissionStatusBadge from './CommissionStatusBadge.vue'

const commissionStore = useCommissionStore()
const isLoading = ref(false)

onMounted(async () => {
  isLoading.value = true
  await Promise.all([
    commissionStore.fetchCommissions(),
    commissionStore.loadStats()
  ])
  isLoading.value = false
})

const updateStatus = async (id, statusData) => {
  await commissionStore.updateCommissionStatus(id, statusData)
}
</script>

<template>
  <div class="commission-list">
    <h2>Commissions</h2>
    
    <div v-if="isLoading">Loading commissions...</div>
    
    <div v-else>
      <div class="stats">
        <div class="stat-card">
          <h3>Total</h3>
          <p>{{ commissionStore.stats.total }}</p>
        </div>
        <div class="stat-card pending">
          <h3>Pending</h3>
          <p>{{ commissionStore.stats.pending }}</p>
        </div>
        <div class="stat-card paid">
          <h3>Paid</h3>
          <p>{{ commissionStore.stats.paid }}</p>
        </div>
        <div class="stat-card overdue">
          <h3>Overdue</h3>
          <p>{{ commissionStore.stats.overdue }}</p>
        </div>
      </div>

      <div class="filters">
        <select v-model="commissionStore.filters.status">
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Paid">Paid</option>
          <option value="Overdue">Overdue</option>
        </select>
        
        <input 
          type="date" 
          v-model="commissionStore.filters.dateRange[0]" 
          placeholder="From date"
        >
        <input 
          type="date" 
          v-model="commissionStore.filters.dateRange[1]" 
          placeholder="To date"
        >
      </div>
      
      <table class="commission-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Due Date</th>
            <th>Payment Date</th>
            <th>Recommendation</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="commission in commissionStore.filteredCommissions" :key="commission._id">
            <td>{{ commission._id.slice(-6) }}</td>
            <td>{{ commission.amount }} {{ commission.currency }}</td>
            <td>
              <CommissionStatusBadge 
                :status="commission.status"
                @update="updateStatus(commission._id, $event)"
              />
            </td>
            <td>{{ new Date(commission.dueDate).toLocaleDateString() }}</td>
            <td>
              {{ commission.paymentDate ? new Date(commission.paymentDate).toLocaleDateString() : '-' }}
            </td>
            <td>
              {{ commission.recommendation?.teacher?.name }} → 
              {{ commission.recommendation?.school?.name }}
            </td>
            <td>
              <button @click="$router.push(`/commissions/${commission._id}`)">
                View Details
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      
      <div class="pagination">
        <button 
          @click="commissionStore.currentPage--; commissionStore.fetchCommissions()"
          :disabled="commissionStore.currentPage <= 1"
        >
          Previous
        </button>
        <span>Page {{ commissionStore.currentPage }} of {{ commissionStore.totalPages }}</span>
        <button 
          @click="commissionStore.currentPage++; commissionStore.fetchCommissions()"
          :disabled="commissionStore.currentPage >= commissionStore.totalPages"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.commission-table {
  width: 100%;
  border-collapse: collapse;
}

.commission-table th, .commission-table td {
  padding: 8px;
  border: 1px solid #ddd;
  text-align: left;
}

.commission-table tr:nth-child(even) {
  background-color: #f2f2f2;
}

.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.stats {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.stat-card {
  flex: 1;
  padding: 1rem;
  border-radius: 4px;
  background-color: #f8f9fa;
}

.stat-card.pending {
  background-color: #fff7e6;
}

.stat-card.paid {
  background-color: #f6ffed;
}

.stat-card.overdue {
  background-color: #fff1f0;
}

.pagination {
  margin-top: 1rem;
  display: flex;
  gap: 1rem;
  align-items: center;
}
</style>
