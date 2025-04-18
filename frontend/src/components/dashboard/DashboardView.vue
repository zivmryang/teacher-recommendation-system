<script setup>
import { onMounted } from 'vue'
import { useCommissionStore } from '../../stores/commissionStore'
import { useRecommendationStore } from '../../stores/recommendationStore'
import { useTeacherStore } from '../../stores/teacherStore'
import { useSchoolStore } from '../../stores/schoolStore'

const commissionStore = useCommissionStore()
const recommendationStore = useRecommendationStore()
const teacherStore = useTeacherStore()
const schoolStore = useSchoolStore()

onMounted(async () => {
  await Promise.all([
    commissionStore.loadStats(),
    recommendationStore.fetchStats(),
    teacherStore.fetchStats(),
    schoolStore.fetchStats()
  ])
})
</script>

<template>
  <div class="dashboard">
    <h1>Dashboard</h1>
    
    <div class="stats-grid">
      <!-- Commission Stats -->
      <div class="stat-card">
        <h3>Total Commissions</h3>
        <p>{{ commissionStore.stats.total }}</p>
      </div>
      <div class="stat-card pending">
        <h3>Pending Payments</h3>
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
      
      <!-- Recommendation Stats -->
      <div class="stat-card">
        <h3>Total Recommendations</h3>
        <p>{{ recommendationStore.stats.total }}</p>
      </div>
      <div class="stat-card">
        <h3>Successful</h3>
        <p>{{ recommendationStore.stats.successful }}</p>
      </div>
      <div class="stat-card">
        <h3>In Progress</h3>
        <p>{{ recommendationStore.stats.inProgress }}</p>
      </div>
      
      <!-- Teacher Stats -->
      <div class="stat-card">
        <h3>Total Teachers</h3>
        <p>{{ teacherStore.stats.total }}</p>
      </div>
      <div class="stat-card">
        <h3>Available</h3>
        <p>{{ teacherStore.stats.available }}</p>
      </div>
      
      <!-- School Stats -->
      <div class="stat-card">
        <h3>Total Schools</h3>
        <p>{{ schoolStore.stats.total }}</p>
      </div>
      <div class="stat-card">
        <h3>Active Hiring</h3>
        <p>{{ schoolStore.stats.activeHiring }}</p>
      </div>
    </div>
    
    <div class="recent-activity">
      <h2>Recent Activity</h2>
      <!-- Would implement activity feed here -->
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  padding: 1rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
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

.stat-card h3 {
  margin-top: 0;
  color: #666;
  font-size: 1rem;
}

.stat-card p {
  margin-bottom: 0;
  font-size: 1.5rem;
  font-weight: bold;
}

.recent-activity {
  background-color: white;
  padding: 1rem;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}
</style>
