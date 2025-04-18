import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'
import TeacherListView from '../views/TeacherListView.vue'
import TeacherFormView from '../views/TeacherFormView.vue'
import SchoolListView from '../views/SchoolListView.vue'
import SchoolFormView from '../views/SchoolFormView.vue'
import RecommendationListView from '../views/RecommendationListView.vue'
import CommissionListView from '../views/CommissionListView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { requiresAuth: false }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      meta: { requiresAuth: true }
    },
    {
      path: '/teachers',
      name: 'teachers',
      component: TeacherListView,
      meta: { requiresAuth: true }
    },
    {
      path: '/teachers/new',
      name: 'new-teacher',
      component: TeacherFormView,
      meta: { requiresAuth: true }
    },
    {
      path: '/teachers/:id/edit',
      name: 'edit-teacher',
      component: TeacherFormView,
      meta: { requiresAuth: true }
    },
    {
      path: '/schools',
      name: 'schools',
      component: SchoolListView,
      meta: { requiresAuth: true }
    },
    {
      path: '/schools/new',
      name: 'new-school',
      component: SchoolFormView,
      meta: { requiresAuth: true }
    },
    {
      path: '/schools/:id/edit',
      name: 'edit-school',
      component: SchoolFormView,
      meta: { requiresAuth: true }
    },
    {
      path: '/recommendations',
      name: 'recommendations',
      component: RecommendationListView,
      meta: { requiresAuth: true }
    },
    {
      path: '/commissions',
      name: 'commissions',
      component: CommissionListView,
      meta: { requiresAuth: true }
    },
    {
      path: '/',
      redirect: '/dashboard'
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/dashboard'
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  // Check if route requires authentication
  if (to.meta.requiresAuth) {
    const isAuthenticated = await authStore.checkAuth()
    if (!isAuthenticated) {
      return next('/login')
    }
  }

  // If going to login but already authenticated
  if (to.name === 'login' && authStore.isAuthenticated) {
    return next('/dashboard')
  }

  next()
})

export default router
