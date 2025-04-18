<script setup>
import { ref } from 'vue'

const props = defineProps({
  status: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['update'])

const showDialog = ref(false)
const newStatus = ref(props.status)
const notes = ref('')

const statusOptions = [
  'Recommended',
  'Pending',
  'Interview Scheduled',
  'Offer Sent',
  'Hired',
  'Rejected'
]

const handleUpdate = () => {
  emit('update', newStatus.value, notes.value)
  showDialog.value = false
}
</script>

<template>
  <div class="status-container">
    <span 
      class="status-badge"
      :class="status.toLowerCase().replace(' ', '-')"
      @click="showDialog = true"
    >
      {{ status }}
    </span>

    <dialog v-if="showDialog" class="status-dialog">
      <h3>Update Recommendation Status</h3>
      
      <div class="form-group">
        <label>New Status</label>
        <select v-model="newStatus">
          <option v-for="option in statusOptions" :key="option" :value="option">
            {{ option }}
          </option>
        </select>
      </div>
      
      <div class="form-group">
        <label>Notes</label>
        <textarea v-model="notes" placeholder="Add any notes about this status change"></textarea>
      </div>
      
      <div class="dialog-actions">
        <button @click="showDialog = false">Cancel</button>
        <button @click="handleUpdate">Update</button>
      </div>
    </dialog>
  </div>
</template>

<style scoped>
.status-badge {
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
}

.status-badge.recommended {
  background-color: #e6f7ff;
  color: #1890ff;
}

.status-badge.pending {
  background-color: #fff7e6;
  color: #fa8c16;
}

.status-badge.interview-scheduled {
  background-color: #f6ffed;
  color: #52c41a;
}

.status-badge.offer-sent {
  background-color: #f0f5ff;
  color: #2f54eb;
}

.status-badge.hired {
  background-color: #f6ffed;
  color: #389e0d;
}

.status-badge.rejected {
  background-color: #fff1f0;
  color: #f5222d;
}

.status-dialog {
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  min-width: 300px;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
}

.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.5rem;
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1rem;
}
</style>
