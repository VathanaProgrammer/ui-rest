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
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center p-4 sm:p-8 font-sans text-white">
    <div class="backdrop-blur-xl bg-white/5 shadow-2xl border border-white/10 rounded-3xl p-6 sm:p-10 w-full max-w-lg transition-all duration-300">
      
      <h1 class="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-8 text-center tracking-tight">
        ✨ Task Master ✨
      </h1>
      
      <div v-if="error" class="bg-red-500/20 text-red-200 p-4 rounded-xl mb-6 text-sm border border-red-500/30 flex items-center gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
        {{ error }}
      </div>
      
      <form @submit.prevent="handleAdd" class="flex flex-col sm:flex-row gap-3 mb-8">
        <input 
          type="text" 
          v-model="newTodoText" 
          placeholder="What needs to be done today?" 
          autofocus
          class="flex-1 bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition shadow-inner"
        />
        <button 
          type="submit"
          class="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-purple-500/30 transform hover:-translate-y-0.5 active:translate-y-0"
        >
          Add Task
        </button>
      </form>

      <ul v-if="todos.length > 0" class="space-y-3">
        <li 
          v-for="todo in todos" 
          :key="todo.id" 
          @click="toggleTodo(todo.id)"
          class="group flex items-center p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all duration-200 cursor-pointer transform hover:scale-[1.01]"
        >
          <div 
            class="w-6 h-6 rounded-full border-2 mr-4 flex-shrink-0 flex items-center justify-center transition-colors duration-300"
            :class="todo.completed ? 'bg-gradient-to-br from-purple-400 to-pink-400 border-transparent' : 'border-white/30 group-hover:border-purple-400'"
          >
            <svg v-if="todo.completed" class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span 
            class="text-lg transition-all duration-300 select-none"
            :class="todo.completed ? 'text-white/40 line-through' : 'text-white/90 group-hover:text-white'"
          >
            {{ todo.text }}
          </span>
        </li>
      </ul>
      
      <div v-else class="text-center py-10 opacity-60">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-4 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
        <p class="text-lg">No tasks found.<br/>You're all caught up!</p>
      </div>
    </div>
  </div>
</template>
