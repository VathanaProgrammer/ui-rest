<script setup lang="ts">
import { ref, onMounted, type Ref } from 'vue'
import { useApiStream, type EventHandlers } from './composables/useApiStream'

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

// Define the backend URL based on the environment
const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:7444/api'

// Initialize the generic composable and point it to the 'todos' endpoint
const { 
  dataList: todos, 
  error, 
  createItem, 
  updateItem, 
  connectStream 
} = useApiStream<Todo>(baseUrl, 'todos')

// Define the specific SSE event listeners for Todos
const eventHandlers: EventHandlers<Todo> = {
  'TODO_ADDED': (event: MessageEvent, listRef: Ref<Todo[]>) => {
    const newTodo = JSON.parse(event.data) as Todo
    listRef.value.push(newTodo)
  },
  'TODO_UPDATED': (event: MessageEvent, listRef: Ref<Todo[]>) => {
    const updatedTodo = JSON.parse(event.data) as Todo
    const index = listRef.value.findIndex(t => t.id === updatedTodo.id)
    if (index !== -1) {
      listRef.value[index] = updatedTodo
    }
  }
}

// Automatically connect the real-time stream when the component mounts
onMounted(() => {
  connectStream(eventHandlers)
})

// Local UI State
const newTodoText = ref('')

// Wrapper to submit and clear the input field
const handleAdd = async () => {
  if (!newTodoText.value.trim()) return
  await createItem({ text: newTodoText.value })
  newTodoText.value = ''
}

// Wrapper to toggle a todo
const toggleTodo = async (id: string | number) => {
  await updateItem(id, 'toggle')
}
</script>

<template>
  <div class="glass-card">
    <h1>✨ Task Master ✨</h1>
    
    <div v-if="error" class="error-msg">{{ error }}</div>
    
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
