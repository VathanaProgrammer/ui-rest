import { ref, onMounted, onUnmounted } from 'vue'
import axios from 'axios'

/**
 * A highly reusable Vue composable for real-time Todo management.
 * Encapsulates all routing, API data fetching (GET/POST/PUT), and real-time (SSE) listening.
 */
export function useTodos(baseUrl) {
  const todos = ref([])
  const error = ref(null)
  let eventSource = null

  // --- STANDARD API ROUTING & FETCHING ---

  // GET: Fetch all initial data from the server
  const fetchTodos = async () => {
    try {
      const response = await axios.get(`${baseUrl}/todos`)
      todos.value = response.data
    } catch (err) {
      error.value = 'Failed to fetch initial data.'
      console.error(err)
    }
  }

  // POST: Send new data to the server
  const addTodo = async (text) => {
    if (!text.trim()) return
    try {
      await axios.post(`${baseUrl}/todos`, { text })
    } catch (err) {
      error.value = 'Failed to add the task.'
      console.error(err)
    }
  }

  // PUT: Update existing data on the server
  const toggleTodo = async (id) => {
    try {
      await axios.put(`${baseUrl}/todos/${id}/toggle`)
    } catch (err) {
      error.value = 'Failed to update the task.'
      console.error(err)
    }
  }

  // --- REAL-TIME SERVER-SENT EVENTS (SSE) ---

  // Connects to the backend stream and listens for specific, named events
  const setupRealTime = () => {
    eventSource = new EventSource(`${baseUrl}/todos/stream`)
    
    // The server initialized a full list push
    eventSource.addEventListener('INIT', (event) => {
      todos.value = JSON.parse(event.data)
    })

    // The server broadcasted that someone (or us) added a new item
    eventSource.addEventListener('TODO_ADDED', (event) => {
      const newTodo = JSON.parse(event.data)
      todos.value.push(newTodo)
    })

    // The server broadcasted that an item was updated
    eventSource.addEventListener('TODO_UPDATED', (event) => {
      const updatedTodo = JSON.parse(event.data)
      const index = todos.value.findIndex(t => t.id === updatedTodo.id)
      if (index !== -1) {
        todos.value[index] = updatedTodo
      }
    })

    // Handle connection drops by automatically attempting to reconnect
    eventSource.onerror = (err) => {
      console.error('Real-Time Connection dropped. Reconnecting...', err)
      eventSource.close()
      setTimeout(setupRealTime, 5000)
    }
  }

  // --- VUE LIFECYCLE HOOKS ---

  onMounted(() => {
    fetchTodos()
    setupRealTime()
  })

  onUnmounted(() => {
    if (eventSource) {
      eventSource.close()
    }
  })

  // Expose the reactive state and actions to the component
  return {
    todos,
    error,
    addTodo,
    toggleTodo
  }
}
