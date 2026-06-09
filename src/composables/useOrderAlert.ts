import { ref } from 'vue'

export interface AlertData {
  title: string
  timeText?: string
  table?: string
  guests?: number
  orderType?: string
  orderName?: string
  actionLabel?: string
  onAction?: () => void
  playSound?: boolean
  soundUrl?: string
}

// These are defined OUTSIDE the composable function so they act as a global singleton state
const activeAlert = ref<AlertData | null>(null)
let timeoutId: number | null = null

export function useOrderAlert() {
  /**
   * Triggers a global alert popup.
   * @param data The alert content
   * @param durationMs Time in milliseconds before auto-dismiss (0 = infinite)
   */
  const showAlert = (data: AlertData, durationMs: number = 8000) => {
    activeAlert.value = data
    
    // Play sound if requested
    if (data.playSound) {
      // Use the provided sound URL or a louder restaurant bell
      const url = data.soundUrl || 'https://actions.google.com/sounds/v1/alarms/dinner_bell_triangle.ogg'
      const audio = new Audio(url)
      audio.play().catch(e => console.warn('Audio playback was blocked by the browser. User must interact with the page first.', e))
    }

    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    if (durationMs > 0) {
      timeoutId = window.setTimeout(() => {
        activeAlert.value = null
      }, durationMs)
    }
  }

  /**
   * Manually dismisses the current alert.
   */
  const dismissAlert = () => {
    activeAlert.value = null
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
  }

  return {
    activeAlert,
    showAlert,
    dismissAlert
  }
}
