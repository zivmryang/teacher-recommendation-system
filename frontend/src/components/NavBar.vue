<script setup>
import { useAuthStore } from '../stores/authStore'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const logout = async () => {
  await authStore.logout()
  router.push('/login')
}
</script>

<template>
  <nav class="navbar">
    <div class="navbar-brand">
      <router-link to="/dashboard" class="logo">
        Teacher Recommendation System
      </router-link>
    </div>
    
    <div class="navbar-menu">
      <router-link 
        v-for="link in [
          { path: '/dashboard', name: 'Dashboard' },
          { path: '/teachers', name: 'Teachers' },
          { path: '/schools', name: 'Schools' },
          { path: '/recommendations', name: 'Recommendations' },
          { path: '/commissions', name: 'Commissions' }
        ]"
        :key="link.path"
        :to="link.path"
        class="nav-link"
        active-class="active"
      >
        {{ link.name }}
      </router-link>
    </div>

    <div class="navbar-user">
      <span v-if="authStore.user" class="user-name">
        {{ authStore.user.name }}
      </span>
      <button @click="logout" class="logout-button">
        Logout
      </button>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #1890ff;
  color: white;
}

.logo {
  color: white;
  font-weight: bold;
  text-decoration: none;
  font-size: 1.2rem;
}

.navbar-menu {
  display: flex;
  gap: 1.5rem;
}

.nav-link {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.nav-link.active {
  background-color: rgba(255, 255, 255, 0.2);
}

.navbar-user {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-name {
  font-weight: 500;
}

.logout-button {
  background-color: transparent;
  color: white;
  border: 1px solid white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.logout-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
}
</style>
