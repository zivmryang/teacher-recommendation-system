<script setup>
import { ref, onMounted } from 'vue'
import { useTaskStore } from '../../stores/taskStore'
import { useTeacherStore } from '../../stores/teacherStore'
import { useSchoolStore } from '../../stores/schoolStore'
import { useRecommendationStore } from '../../stores/recommendationStore'

const props = defineProps({
  taskId: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['submit'])

const taskStore = useTaskStore()
const teacherStore = useTeacherStore()
const schoolStore = useSchoolStore()
const recommendationStore = useRecommendationStore()

const task = ref({
  title: '',
  description: '',
  type: 'TeacherFollowUp',
  assignedTo: '',
  relatedTeacher: '',
  relatedSchool: '',
  relatedRecommendation: '',
  dueDate: '',
  priority: 'Medium'
})

const isLoading = ref(false)
const isEditing = ref(false)

onMounted(async () => {
  isLoading.value = true
  
  // Load related data
  await Promise.all([
    teacherStore.fetchTeachers(),
    schoolStore.fetchSchools(),
    recommendationStore.fetchRecommendations()
  ])

  // If editing, load task data
  if (props.taskId) {
    isEditing.value = true
    const existingTask = await taskStore.getTaskById(props.taskId)
    task.value = { ...existingTask }
  }

  isLoading.value = false
})

const handleSubmit = async () => {
  try {
    if (isEditing.value) {
      await taskStore.updateTask(props.taskId, task.value)
    } else {
      await taskStore.createTask(task.value)
    }
    emit('submit')
  } catch (error) {
    console.error('Failed to save task:', error)
  }
}
</script>

<template>
  <div class="task-form">
    <h2>{{ isEditing ? 'Edit Task' : 'Create New Task' }}</h2>
    
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label>Title *</label>
        <input v-model="task.title" required />
      </div>
      
      <div class="form-group">
        <label>Description</label>
        <textarea v-model="task.description" />
      </div>
      
      <div class="form-row">
        <div class="form-group">
          <label>Type *</label>
          <select v-model="task.type" required>
            <option value="TeacherFollowUp">Teacher Follow-up</option>
            <option value="SchoolFollowUp">School Follow-up</option>
            <option value="Interview">Interview</option>
            <option value="Contract">Contract</option>
          </select>
        </div>
        
        <div class="form-group">
          <label>Priority *</label>
          <select v-model="task.priority" required>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
      </div>
      
      <div class="form-group">
        <label>Due Date</label>
        <input type="date" v-model="task.dueDate" />
      </div>
      
      <div class="form-group">
        <label>Related Teacher</label>
        <select v-model="task.relatedTeacher">
          <option value="">None</option>
          <option 
            v-for="teacher in teacherStore.teachers" 
            :key="teacher._id" 
            :value="teacher._id"
          >
            {{ teacher.name }}
          </option>
        </select>
      </div>
      
      <div class="form-group">
        <label>Related School</label>
        <select v-model="task.relatedSchool">
          <option value="">None</option>
          <option 
            v-for="school in schoolStore.schools" 
            :key="school._id" 
            :value="school._id"
          >
            {{ school.name }}
          </option>
        </select>
      </div>
      
      <div class="form-group">
        <label>Related Recommendation</label>
        <select v-model="task.relatedRecommendation">
          <option value="">None</option>
          <option 
            v-for="rec in recommendationStore.recommendations" 
            :key="rec._id" 
            :value="rec._id"
          >
            {{ rec.teacher?.name }} → {{ rec.school?.name }}
          </option>
        </select>
      </div>
      
      <div class="form-actions">
        <button type="submit">
          {{ isEditing ? 'Update Task' : 'Create Task' }}
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.task-form {
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
