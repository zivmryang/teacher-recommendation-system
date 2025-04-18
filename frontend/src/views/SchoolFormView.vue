<script setup>
import { onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useSchoolStore } from '../stores/schoolStore'
import SchoolForm from '../components/schools/SchoolForm.vue'

const router = useRouter()
const route = useRoute()
const schoolStore = useSchoolStore()

const school = ref({
  name: '',
  city: '',
  contactName: '',
  contactWechatId: '',
  schoolType: '',
  jobPositions: [],
  salaryRange: '',
  workingHours: '',
  accommodation: false,
  status: 'active'
})
const isLoading = ref(false)
const isEditing = ref(false)

onMounted(async () => {
  if (route.params.id) {
    isEditing.value = true
    isLoading.value = true
    try {
      const fetchedSchool = await schoolStore.getSchoolById(route.params.id)
      school.value = { ...fetchedSchool }
    } catch (error) {
      console.error('Failed to fetch school:', error)
    } finally {
      isLoading.value = false
    }
  }
})

const handleSubmit = async () => {
  isLoading.value = true
  try {
    if (isEditing.value) {
      await schoolStore.updateSchool(route.params.id, school.value)
    } else {
      await schoolStore.createSchool(school.value)
    }
    router.push('/schools')
  } catch (error) {
    console.error('Failed to save school:', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="school-form-view">
    <div class="header">
      <h1>{{ isEditing ? 'Edit School' : 'Add New School' }}</h1>
      <router-link to="/schools" class="back-button">
        Back to List
      </router-link>
    </div>

    <div v-if="isLoading" class="loading">
      {{ isEditing ? 'Loading school...' : 'Creating school...' }}
    </div>
    <SchoolForm 
      v-else
      :school="school"
      :is-editing="isEditing"
      @submit="handleSubmit"
    />
  </div>
</template>

<style scoped>
.school-form-view {
  padding: 1rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.back-button {
  background-color: #f5f5f5;
  color: #333;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  text-decoration: none;
  border: 1px solid #ddd;
}

.loading {
  text-align: center;
  padding: 2rem;
  color: #666;
}
</style>
