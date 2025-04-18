<script setup>
import { onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useTeacherStore } from '../stores/teacherStore'
import TeacherForm from '../components/teachers/TeacherForm.vue'

const router = useRouter()
const route = useRoute()
const teacherStore = useTeacherStore()

const teacher = ref({
  name: '',
  gender: '',
  nationality: '',
  education: '',
  resume: '',
  expectedPosition: '',
  availableFrom: '',
  visaStatus: '',
  contact: '',
  tags: []
})
const isLoading = ref(false)
const isEditing = ref(false)

onMounted(async () => {
  if (route.params.id) {
    isEditing.value = true
    isLoading.value = true
    try {
      const fetchedTeacher = await teacherStore.getTeacherById(route.params.id)
      teacher.value = { ...fetchedTeacher }
    } catch (error) {
      console.error('Failed to fetch teacher:', error)
    } finally {
      isLoading.value = false
    }
  }
})

const handleSubmit = async () => {
  isLoading.value = true
  try {
    if (isEditing.value) {
      await teacherStore.updateTeacher(route.params.id, teacher.value)
    } else {
      await teacherStore.createTeacher(teacher.value)
    }
    router.push('/teachers')
  } catch (error) {
    console.error('Failed to save teacher:', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="teacher-form-view">
    <div class="header">
      <h1>{{ isEditing ? 'Edit Teacher' : 'Add New Teacher' }}</h1>
      <router-link to="/teachers" class="back-button">
        Back to List
      </router-link>
    </div>

    <div v-if="isLoading" class="loading">
      {{ isEditing ? 'Loading teacher...' : 'Creating teacher...' }}
    </div>
    <TeacherForm 
      v-else
      :teacher="teacher"
      :is-editing="isEditing"
      @submit="handleSubmit"
    />
  </div>
</template>

<style scoped>
.teacher-form-view {
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
