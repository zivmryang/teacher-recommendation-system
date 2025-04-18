<script setup>
import { useAuthStore } from '../stores/authStore'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <div class="dashboard-view">
    <header class="dashboard-header">
      <h1>Dashboard</h1>
      <button @click="handleLogout" class="logout-button">
        Logout
      </button>
    </header>

    <main class="dashboard-content">
      <div class="welcome-message">
        <h2>Welcome, {{ authStore.user?.name }}</h2>
        <p>Department: {{ authStore.user?.department }}</p>
      </div>

      <div class="dashboard-sections">
        <router-link to="/teachers" class="dashboard-card">
          <h3>Teacher Management</h3>
          <p>View and manage all teachers</p>
        </router-link>

        <router-link to="/schools" class="dashboard-card">
          <h3>School Management</h3>
          <p>View and manage all schools</p>
        </router-link>

        <router-link to="/recommendations" class="dashboard-card">
          <h3>Recommendations</h3>
          <p>Manage teacher-school matches</p>
        </router-link>

        <router-link to="/commissions" class="dashboard-card">
          <h3>Commissions</h3>
          <p>View and track commissions</p>
        </router-link>
      </div>
    </main>
  </div>
</template>

<style scoped>
.dashboard-view {
  padding: 1rem;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.logout-button {
  background-color: #f44336;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.logout-button:hover {
  background-color: #d32f2f;
}

.welcome-message {
  margin-bottom: 2rem;
}

.dashboard-sections {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}

.dashboard-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  text-decoration: none;
  color: inherit;
  transition: transform 0.2s, box-shadow 0.2s;
}

.dashboard-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

.dashboard-card h3 {
  margin-top: 0;
  color: #333;
}

.dashboard-card p {
  color: #666;
  margin-bottom: 0;
}
</style>
