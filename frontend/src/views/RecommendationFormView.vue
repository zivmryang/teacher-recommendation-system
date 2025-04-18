<script setup>
import { onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useRecommendationStore, useTeacherStore, useSchoolStore } from '../stores'
import RecommendationForm from '../components/recommendations/RecommendationForm.vue'

const router = useRouter()
const route = useRoute()
const recommendationStore = useRecommendationStore()
const teacherStore = useTeacherStore()
const schoolStore = useSchoolStore()

const recommendation = ref({
  teacherId: '',
  schoolId: '',
  assignedTo: '',
  status: 'Recommended',
  notes: ''
})
const isLoading = ref(false)
const isEditing = ref(false)

onMounted(async () => {
  isLoading.value = true
  try {
    await Promise.all([
      teacherStore.fetchTeachers(),
      schoolStore.fetchSchools()
    ])

    if (route.params.id) {
      isEditing.value = true
      const fetchedRecommendation = await recommendationStore.getRecommendationById(route.params.id)
      recommendation.value = { ...fetchedRecommendation }
    }
  } catch (error) {
    console.error('Failed to load data:', error)
  } finally {
    isLoading.value = false
  }
})

const handleSubmit = async () => {
  isLoading.value = true
  try {
    if (isEditing.value) {
      await recommendationStore.updateRecommendation(route.params.id, recommendation.value)
    } else {
      await recommendationStore.createRecommendation(recommendation.value)
    }
    router.push('/recommendations')
  } catch (error) {
    console.error('Failed to save recommendation:', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="recommendation-form-view">
    <div class="header">
      <h1>{{ isEditing ? 'Edit Recommendation' : 'Create New Recommendation' }}</h1>
      <router-link to="/recommendations" class="back-button">
        Back to List
      </router-link>
    </div>

    <div v-if="isLoading" class="loading">
      {{ isEditing ? 'Loading recommendation...' : 'Creating recommendation...' }}
    </div>
    <RecommendationForm 
      v-else
      :recommendation="recommendation"
      :teachers="teacherStore.teachers"
      :schools="schoolStore.schools"
      :is-editing="isEditing"
      @submit="handleSubmit"
    />
  </div>
</template>

<style scoped>
.recommendation-form-view {
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
