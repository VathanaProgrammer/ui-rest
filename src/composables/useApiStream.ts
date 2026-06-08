import { ref, type Ref, onUnmounted } from 'vue'
import { api } from '../utils/api'

export type EventHandler<T> = (event: MessageEvent, listRef: Ref<T[]>) => void;
export type EventHandlers<T> = Record<string, EventHandler<T>>;

/**
 * A highly reusable, generic Vue composable for API interactions and real-time SSE.
 * It is completely independent of "todos" and can be used for any resource type.
 * 
 * @param baseUrl - The base API URL (e.g., http://localhost:7444/api)
 * @param endpoint - The specific resource endpoint (e.g., 'todos', 'users', 'posts')
 */
export function useApiStream<T>(baseUrl: string, endpoint: string) {
  const dataList = ref<T[]>([]) as Ref<T[]>
  const error = ref<string | null>(null)
  let eventSource: EventSource | null = null

  const resourceUrl = `${baseUrl}/${endpoint}`

  // --- STANDARD API ROUTING & FETCHING ---

  const fetchData = async (): Promise<void> => {
    try {
      const response = await api.get<any>(resourceUrl)
      dataList.value = response.data || response
    } catch (err) {
      error.value = `Failed to fetch ${endpoint} data.`
      console.error(err)
    }
  }

  const createItem = async (payload: any): Promise<void> => {
    try {
      await api.post(resourceUrl, payload)
    } catch (err) {
      error.value = `Failed to create item in ${endpoint}.`
      console.error(err)
    }
  }

  const updateItem = async (id: string | number, actionPath: string = '', payload: any = {}): Promise<void> => {
    try {
      const url = actionPath ? `${resourceUrl}/${id}/${actionPath}` : `${resourceUrl}/${id}`
      await api.put(url, payload)
    } catch (err) {
      error.value = `Failed to update item in ${endpoint}.`
      console.error(err)
    }
  }

  const deleteItem = async (id: string | number): Promise<void> => {
    try {
      await api.delete(`${resourceUrl}/${id}`)
    } catch (err) {
      error.value = `Failed to delete item in ${endpoint}.`
      console.error(err)
    }
  }

  // --- REAL-TIME SERVER-SENT EVENTS (SSE) ---

  /**
   * Connects to the SSE stream. 
   * @param eventHandlers - A map of event names to handler functions.
   */
  const connectStream = (eventHandlers: EventHandlers<T> = {}) => {
    fetchData() // Always fetch initial state upon connecting

    eventSource = new EventSource(`${resourceUrl}/stream`)
    
    // Generic INIT fallback
    eventSource.addEventListener('INIT', (event: MessageEvent) => {
      dataList.value = JSON.parse(event.data) as T[]
    })

    // Register dynamic custom handlers passed from the component
    for (const [eventName, handler] of Object.entries(eventHandlers)) {
      eventSource.addEventListener(eventName, (event: Event) => handler(event as MessageEvent, dataList))
    }

    // Handle connection drops by automatically attempting to reconnect
    eventSource.onerror = (err: Event) => {
      console.error(`[${endpoint}] Real-Time Connection dropped. Reconnecting...`, err)
      if (eventSource) {
        eventSource.close()
      }
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
