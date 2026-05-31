<script setup>
import { ref } from 'vue'
import { useTodos } from './composables/useTodos'

// Define the backend URL based on the environment
const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:7444/api'

// Destructure our powerful, reusable real-time networking logic
const { todos, error, addTodo, toggleTodo } = useTodos(baseUrl)

// Local UI State
const newTodoText = ref('')

// Wrapper to submit and clear the input field
const handleAdd = async () => {
  if (!newTodoText.value.trim()) return
  await addTodo(newTodoText.value)
  newTodoText.value = ''
}
</script>

<template>
  <div class="glass-card">
    <h1>✨ Task Master ✨</h1>
    
    <form @submit.prevent="handleAdd" class="input-group">
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
