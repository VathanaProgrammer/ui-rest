import { ref, onUnmounted } from 'vue'
import axios from 'axios'

/**
 * A highly reusable, generic Vue composable for API interactions and real-time SSE.
 * It is completely independent of "todos" and can be used for any resource type.
 * 
 * @param {string} baseUrl - The base API URL (e.g., http://localhost:7444/api)
 * @param {string} endpoint - The specific resource endpoint (e.g., 'todos', 'users', 'posts')
 */
export function useApiStream(baseUrl, endpoint) {
  const dataList = ref([])
  const error = ref(null)
  let eventSource = null

  const resourceUrl = `${baseUrl}/${endpoint}`

  // --- STANDARD API ROUTING & FETCHING ---

  const fetchData = async () => {
    try {
      const response = await axios.get(resourceUrl)
      dataList.value = response.data
    } catch (err) {
      error.value = `Failed to fetch ${endpoint} data.`
      console.error(err)
    }
  }

  const createItem = async (payload) => {
    try {
      await axios.post(resourceUrl, payload)
    } catch (err) {
      error.value = `Failed to create item in ${endpoint}.`
      console.error(err)
    }
  }

  const updateItem = async (id, actionPath = '', payload = {}) => {
    try {
      const url = actionPath ? `${resourceUrl}/${id}/${actionPath}` : `${resourceUrl}/${id}`
      await axios.put(url, payload)
    } catch (err) {
      error.value = `Failed to update item in ${endpoint}.`
      console.error(err)
    }
  }

  const deleteItem = async (id) => {
    try {
      await axios.delete(`${resourceUrl}/${id}`)
    } catch (err) {
      error.value = `Failed to delete item in ${endpoint}.`
      console.error(err)
    }
  }

  // --- REAL-TIME SERVER-SENT EVENTS (SSE) ---

  /**
   * Connects to the SSE stream. 
   * @param {Object} eventHandlers - A map of event names to handler functions.
   * Example: { 'TODO_ADDED': (event, dataList) => { ... } }
   */
  const connectStream = (eventHandlers = {}) => {
    fetchData() // Always fetch initial state upon connecting

    eventSource = new EventSource(`${resourceUrl}/stream`)
    
    // Generic INIT fallback
    eventSource.addEventListener('INIT', (event) => {
      dataList.value = JSON.parse(event.data)
    })

    // Register dynamic custom handlers passed from the component
    for (const [eventName, handler] of Object.entries(eventHandlers)) {
      eventSource.addEventListener(eventName, (event) => handler(event, dataList))
    }

    // Handle connection drops by automatically attempting to reconnect
    eventSource.onerror = (err) => {
      console.error(`[${endpoint}] Real-Time Connection dropped. Reconnecting...`, err)
      eventSource.close()
      setTimeout(() => connectStream(eventHandlers), 5000)
    }
  }

  onUnmounted(() => {
    if (eventSource) {
      eventSource.close()
    }
  })

  return {
    dataList,
    error,
    fetchData,
    createItem,
    updateItem,
    deleteItem,
    connectStream
  }
}
