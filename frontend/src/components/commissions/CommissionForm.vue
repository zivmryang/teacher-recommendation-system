<script setup>
import { ref, onMounted } from 'vue'
import { useCommissionStore } from '../../stores/commissionStore'
import { useRecommendationStore } from '../../stores/recommendationStore'

const props = defineProps({
  commissionId: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['submit'])

const commissionStore = useCommissionStore()
const recommendationStore = useRecommendationStore()

const commission = ref({
  recommendation: '',
  amount: '',
  currency: 'CNY',
  dueDate: '',
  notes: ''
})

const isLoading = ref(false)
const isEditing = ref(false)

onMounted(async () => {
  isLoading.value = true
  
  // Load recommendations
  await recommendationStore.fetchRecommendations()

  // If editing, load commission data
  if (props.commissionId) {
    isEditing.value = true
    const existingCommission = await commissionStore.getCommissionById(props.commissionId)
    commission.value = { ...existingCommission }
  }

  isLoading.value = false
})

const handleSubmit = async () => {
  try {
    if (isEditing.value) {
      await commissionStore.updateCommission(props.commissionId, commission.value)
    } else {
      await commissionStore.createCommission(commission.value)
    }
    emit('submit')
  } catch (error) {
    console.error('Failed to save commission:', error)
  }
}
</script>

<template>
  <div class="commission-form">
    <h2>{{ isEditing ? 'Edit Commission' : 'Create New Commission' }}</h2>
    
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label>Recommendation *</label>
        <select v-model="commission.recommendation" required>
          <option value="">Select a recommendation</option>
          <option 
            v-for="rec in recommendationStore.recommendations" 
            :key="rec._id" 
            :value="rec._id"
          >
            {{ rec.teacher?.name }} → {{ rec.school?.name }}
          </option>
        </select>
      </div>
      
      <div class="form-row">
        <div class="form-group">
          <label>Amount *</label>
          <input 
            type="number" 
            v-model="commission.amount" 
            required 
            min="0"
            step="0.01"
          />
        </div>
        
        <div class="form-group">
          <label>Currency *</label>
          <select v-model="commission.currency" required>
            <option value="CNY">CNY</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
          </select>
        </div>
      </div>
      
      <div class="form-group">
        <label>Due Date *</label>
        <input type="date" v-model="commission.dueDate" required />
      </div>
      
      <div class="form-group">
        <label>Notes</label>
        <textarea v-model="commission.notes" />
      </div>
      
      <div class="form-actions">
        <button type="submit">
          {{ isEditing ? 'Update Commission' : 'Create Commission' }}
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.commission-form {
  max-width: 800px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.form-row {
  display: flex;
  gap: 1rem;
}

.form-row .form-group {
  flex: 1;
}

.form-actions {
  margin-top: 1.5rem;
  text-align: right;
}

.form-actions button {
  padding: 0.5rem 1rem;
  background-color: #1890ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.form-actions button:hover {
  background-color: #40a9ff;
}
</style>
