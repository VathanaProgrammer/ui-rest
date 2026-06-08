import { onMounted, onUnmounted } from 'vue'

export type SseEventHandler = (data: any) => void

/**
 * A highly reusable composable for connecting to Server-Sent Events (SSE)
 * anywhere in your Vue app without writing boilerplate code.
 *
 * @param streamPath The endpoint path (e.g., '/test/stream')
 * @param eventHandlers A dictionary mapping event names to their callback functions
 */
export function useRealTime(streamPath: string, eventHandlers: Record<string, SseEventHandler>) {
  let eventSource: EventSource | null = null
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:7444/api'

  const connect = () => {
    // 1. Establish connection
    eventSource = new EventSource(`${baseUrl}${streamPath}`, { withCredentials: true })

    // 2. Register all provided event listeners dynamically
    for (const [eventName, handler] of Object.entries(eventHandlers)) {
      eventSource.addEventListener(eventName, (event: MessageEvent) => {
        // Automatically attempt to parse JSON if possible, otherwise return raw string
        let parsedData = event.data
        try {
          parsedData = JSON.parse(event.data)
        } catch (e) {
          // Data is a simple string, leave it as is
        }
        
        // Fire the callback
        handler(parsedData)
      })
    }

    // 3. Handle auto-reconnects on failure
    eventSource.onerror = (err) => {
      console.warn(`[SSE Error] Connection dropped on ${streamPath}. Browser will auto-reconnect.`, err)
    }
  }

  // Automatically connect when the component mounts
  onMounted(() => {
    connect()
  })

  // Automatically clean up the connection when the component unmounts to prevent memory leaks
  onUnmounted(() => {
    if (eventSource) {
      eventSource.close()
    }
  })

  return {
    // Return a way to manually reconnect if ever needed
    reconnect: () => {
      if (eventSource) eventSource.close()
      connect()
    }
  }
}
