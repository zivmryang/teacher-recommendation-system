<script setup>
import { ref } from 'vue'
import { useSchoolStore } from '../../stores/schoolStore'

const props = defineProps({
  school: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['submit', 'cancel'])

const schoolStore = useSchoolStore()
const formData = ref({ 
  ...props.school,
  jobPositions: props.school?.jobPositions || []
})
const isSubmitting = ref(false)

const handleSubmit = async () => {
  isSubmitting.value = true
  try {
    if (formData.value._id) {
      await schoolStore.updateSchool(formData.value._id, formData.value)
    } else {
      await schoolStore.createSchool(formData.value)
    }
    emit('submit')
  } catch (error) {
    console.error('Error saving school:', error)
  } finally {
    isSubmitting.value = false
  }
}

const addJobPosition = () => {
  formData.value.jobPositions.push({
    position: '',
    startDate: '',
    salaryRange: '',
    requirements: '',
    status: 'Open'
  })
}

const removeJobPosition = (index) => {
  formData.value.jobPositions.splice(index, 1)
}
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <div class="form-group">
      <label>School Name</label>
      <input v-model="formData.name" required>
    </div>

    <div class="form-group">
      <label>City</label>
      <input v-model="formData.city" required>
    </div>

    <div class="form-group">
      <label>School Type</label>
      <select v-model="formData.schoolType" required>
        <option value="International">International</option>
        <option value="Bilingual">Bilingual</option>
        <option value="Public">Public</option>
        <option value="Training Center">Training Center</option>
      </select>
    </div>

    <div class="form-group">
      <label>Contact Name</label>
      <input v-model="formData.contactName" required>
    </div>

    <div class="form-group">
      <label>Contact Email</label>
      <input v-model="formData.contactEmail" type="email">
    </div>

    <div class="form-group">
      <label>Contact WeChat</label>
      <input v-model="formData.contactWechat">
    </div>

    <div class="form-group">
      <label>Status</label>
      <select v-model="formData.status" required>
        <option value="Active">Active</option>
        <option value="Inactive">Inactive</option>
        <option value="Blacklisted">Blacklisted</option>
      </select>
    </div>

    <div class="job-positions">
      <h3>Job Positions</h3>
      <button type="button" @click="addJobPosition">Add Position</button>
      
      <div v-for="(position, index) in formData.jobPositions" :key="index" class="position-item">
        <div class="form-group">
          <label>Position</label>
          <input v-model="position.position" required>
        </div>
        
        <div class="form-group">
          <label>Start Date</label>
          <input v-model="position.startDate" type="date">
        </div>
        
        <div class="form-group">
          <label>Salary Range</label>
          <input v-model="position.salaryRange">
        </div>
        
        <div class="form-group">
          <label>Requirements</label>
          <textarea v-model="position.requirements"></textarea>
        </div>
        
        <div class="form-group">
          <label>Status</label>
          <select v-model="position.status">
            <option value="Open">Open</option>
            <option value="Filled">Filled</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
        
        <button type="button" @click="removeJobPosition(index)">Remove</button>
      </div>
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
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.5rem;
}

.job-positions {
  margin: 2rem 0;
  padding: 1rem;
  border: 1px solid #eee;
}

.position-item {
  margin: 1rem 0;
  padding: 1rem;
  background: #f9f9f9;
}

.form-actions {
  margin-top: 1rem;
  display: flex;
  gap: 1rem;
}
</style>
