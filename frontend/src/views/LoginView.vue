<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/authStore'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()
const error = ref(null)

onMounted(async () => {
  // Check if already logged in
  if (await authStore.checkAuth()) {
    router.push('/dashboard')
  }
})

const handleWeComLogin = () => {
  // This will be replaced with WeCom JS SDK integration
  const code = new URLSearchParams(window.location.search).get('code')
  if (code) {
    authStore.login(code)
      .catch(err => {
        error.value = err.message || 'Login failed'
      })
  } else {
    // Redirect to WeCom auth page
    const corpId = import.meta.env.VITE_WE_COM_CORP_ID
    const redirectUri = encodeURIComponent(window.location.href)
    window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${corpId}&redirect_uri=${redirectUri}&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect`
  }
}

const handleTestLogin = () => {
  authStore.login()
    .catch(err => {
      error.value = err.message || 'Test login failed'
    })
}
</script>

<template>
  <div class="login-container">
    <div class="login-card">
      <h1>Teacher Recommendation System</h1>
      <p>Please login with your WeCom account</p>
      
      <button 
        class="login-button"
        @click="handleWeComLogin"
        :disabled="authStore.isLoading"
      >
        <span v-if="authStore.isLoading">Logging in...</span>
        <span v-else>Login with WeCom</span>
      </button>

      <div class="test-login-divider">
        <span>OR</span>
      </div>

      <button 
        class="test-login-button"
        @click="handleTestLogin"
        :disabled="authStore.isLoading"
      >
        <span>Test Login (Development Only)</span>
      </button>

      <p v-if="error" class="error-message">{{ error }}</p>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
}

.login-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 100%;
  max-width: 400px;
}

.login-card h1 {
  margin-top: 0;
  color: #333;
}

.login-card p {
  color: #666;
  margin-bottom: 2rem;
}

.login-button {
  background-color: #07C160;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  width: 100%;
  transition: background-color 0.2s;
}

.login-button:hover {
  background-color: #06AD56;
}

.login-button:disabled {
  background-color: #95D5A2;
  cursor: not-allowed;
}

.error-message {
  color: #f44336;
  margin-top: 1rem;
}

.test-login-divider {
  display: flex;
  align-items: center;
  margin: 1.5rem 0;
  color: #999;
}

.test-login-divider::before,
.test-login-divider::after {
  content: "";
  flex: 1;
  border-bottom: 1px solid #ddd;
}

.test-login-divider::before {
  margin-right: 0.5rem;
}

.test-login-divider::after {
  margin-left: 0.5rem;
}

.test-login-button {
  background-color: #1976d2;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  width: 100%;
  transition: background-color 0.2s;
  margin-top: 1rem;
}

.test-login-button:hover {
  background-color: #1565c0;
}

.test-login-button:disabled {
  background-color: #90caf9;
  cursor: not-allowed;
}
</style>
