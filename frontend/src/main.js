import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { initWeComSDK } from './utils/wecom'
import { useAuthStore } from './stores/authStore'
import router from './router'

import App from './App.vue'
import './assets/main.css'

const app = createApp(App)

// Initialize Pinia and router
app.use(createPinia())
app.use(router)

// Mount app immediately for development
app.mount('#app')

// Initialize WeCom SDK (will still work if fails in development)
initWeComSDK()
  .then(() => {
    // Check authentication status
    const authStore = useAuthStore()
    return authStore.checkAuth()
  })
  .catch((error) => {
    console.warn('WeCom initialization warning:', error)
  })
