<script setup>
import { ref } from 'vue'
import { useTeacherStore } from '../../stores/teacherStore'

const props = defineProps({
  teacher: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['submit', 'cancel'])

const teacherStore = useTeacherStore()
const formData = ref({ ...props.teacher })
const resumeFile = ref(null)
const isSubmitting = ref(false)

const handleSubmit = async () => {
  isSubmitting.value = true
  try {
    if (formData.value._id) {
      await teacherStore.updateTeacher(formData.value._id, formData.value)
    } else {
      await teacherStore.addTeacher(formData.value)
    }
    
    if (resumeFile.value) {
      await teacherStore.uploadResume(formData.value._id, resumeFile.value)
    }
    
    emit('submit')
  } catch (error) {
    console.error('Error saving teacher:', error)
  } finally {
    isSubmitting.value = false
  }
}

const handleFileChange = (e) => {
  resumeFile.value = e.target.files[0]
}
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <div class="form-group">
      <label>Name</label>
      <input v-model="formData.name" required>
    </div>

    <div class="form-group">
      <label>Gender</label>
      <select v-model="formData.gender" required>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Other">Other</option>
      </select>
    </div>

    <div class="form-group">
      <label>Nationality</label>
      <input v-model="formData.nationality" required>
    </div>

    <div class="form-group">
      <label>Education</label>
      <input v-model="formData.education" required>
    </div>

    <div class="form-group">
      <label>Visa Status</label>
      <select v-model="formData.visaStatus" required>
        <option value="Z-Visa">Z-Visa</option>
        <option value="Work Permit">Work Permit</option>
        <option value="Residence Permit">Residence Permit</option>
        <option value="Tourist Visa">Tourist Visa</option>
        <option value="None">None</option>
      </select>
    </div>

    <div class="form-group">
      <label>Resume</label>
      <input type="file" @change="handleFileChange" accept=".pdf,.jpg,.jpeg">
    </div>

    <div class="form-actions">
      <button type="submit" :disabled="isSubmitting">
        {{ isSubmitting ? 'Saving...' : 'Save' }}
      </button>
      <button type="button" @click="$emit('cancel')">Cancel</button>
    </div>
  </form>
</template>

<style scoped>
.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 0.5rem;
}

.form-actions {
  margin-top: 1rem;
  display: flex;
  gap: 1rem;
}
</style>
