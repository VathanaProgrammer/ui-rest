<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import axios from 'axios'

const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:7444/api'
const todos = ref([])
const newTodoText = ref('')
let eventSource = null

// Fetch initial todos
const fetchTodos = async () => {
  try {
    const response = await axios.get(`${baseUrl}/todos`)
    todos.value = response.data
  } catch (error) {
    console.error('Failed to fetch todos:', error)
  }
}

// Add a new todo
const addTodo = async () => {
  if (!newTodoText.value.trim()) return
  try {
    await axios.post(`${baseUrl}/todos`, { text: newTodoText.value })
    newTodoText.value = ''
  } catch (error) {
    console.error('Failed to add todo:', error)
  }
}

// Toggle a todo
const toggleTodo = async (id) => {
  try {
    await axios.put(`${baseUrl}/todos/${id}/toggle`)
  } catch (error) {
    console.error('Failed to toggle todo:', error)
  }
}

// Set up SSE for real-time updates
const setupSSE = () => {
  eventSource = new EventSource(`${baseUrl}/todos/stream`)
  eventSource.onmessage = (event) => {
    const updatedTodos = JSON.parse(event.data)
    todos.value = updatedTodos
  }
  eventSource.onerror = (error) => {
    console.error('SSE Error:', error)
    eventSource.close()
    // Try reconnecting after 5 seconds
    setTimeout(setupSSE, 5000)
  }
}

onMounted(() => {
  fetchTodos()
  setupSSE()
})

onUnmounted(() => {
  if (eventSource) {
    eventSource.close()
  }
})
</script>

<template>
  <div class="glass-card">
    <h1>✨ Task Master ✨</h1>
    
    <form @submit.prevent="addTodo" class="input-group">
      <input 
        type="text" 
        v-model="newTodoText" 
        placeholder="What needs to be done today?" 
        autofocus
      />
      <button type="submit">Add Task</button>
    </form>

    <ul v-if="todos.length > 0">
      <li 
        v-for="todo in todos" 
        :key="todo.id" 
        :class="{ completed: todo.completed }"
        @click="toggleTodo(todo.id)"
      >
        <div class="todo-item-left">
          <div class="checkbox-wrapper"></div>
          <span class="todo-text">{{ todo.text }}</span>
        </div>
      </li>
    </ul>
    
    <div v-else style="text-align: center; color: rgba(255,255,255,0.5); padding: 2rem 0;">
      <p>No tasks found. You're all caught up!</p>
    </div>
  </div>
</template>
