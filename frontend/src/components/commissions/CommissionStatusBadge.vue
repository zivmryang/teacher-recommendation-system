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
const paymentDate = ref('')
const invoiceNumber = ref('')

const statusOptions = [
  'Pending',
  'Paid',
  'Overdue'
]

const handleUpdate = () => {
  emit('update', {
    status: newStatus.value,
    paymentDate: paymentDate.value,
    invoiceNumber: invoiceNumber.value
  })
  showDialog.value = false
}
</script>

<template>
  <div class="status-container">
    <span 
      class="status-badge"
      :class="status.toLowerCase()"
      @click="showDialog = true"
    >
      {{ status }}
    </span>

    <dialog v-if="showDialog" class="status-dialog">
      <h3>Update Commission Status</h3>
      
      <div class="form-group">
        <label>New Status</label>
        <select v-model="newStatus">
          <option v-for="option in statusOptions" :key="option" :value="option">
            {{ option }}
          </option>
        </select>
      </div>
      
      <div v-if="newStatus === 'Paid'" class="form-group">
        <label>Payment Date</label>
        <input type="date" v-model="paymentDate" />
      </div>
      
      <div v-if="newStatus === 'Paid'" class="form-group">
        <label>Invoice Number</label>
        <input v-model="invoiceNumber" placeholder="Enter invoice number" />
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

.status-badge.pending {
  background-color: #fff7e6;
  color: #fa8c16;
}

.status-badge.paid {
  background-color: #f6ffed;
  color: #52c41a;
}

.status-badge.overdue {
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
.form-group input {
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
