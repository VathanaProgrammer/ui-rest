import axios from 'axios'
import { ref } from 'vue'

interface LoginCredentials {
  employeeId: string
  accessPin: string
}

export function useLogin() {
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  // Since tokens are HttpOnly cookies now, we just track if they are logged in via a simple localStorage flag
  const token = ref<string | null>(localStorage.getItem('isLoggedIn') ? 'true' : null)

  const baseUrl = import.meta.env.VITE_API_BASE_URL || '/api'

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    loading.value = true
    error.value = null

    try {
      const response = await axios.post(
        `${baseUrl}/auth/login`,
        {
          employeeId: credentials.employeeId,
          password: credentials.accessPin // backend expects 'password' field in LoginRequest
        },
        {
          withCredentials: true // Extremely important to receive and send the JWT cookie across origins
        }
      )

      if (response.data.status === 1) { // 1 means success in ApiResponse
        token.value = 'true'
        localStorage.setItem('isLoggedIn', 'true')
        localStorage.setItem('employeeId', credentials.employeeId)
        return true
      } else {
        error.value = response.data.message || 'Login failed. Please check your credentials.'
        return false
      }
    } catch (err: any) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        error.value = 'Invalid Employee ID or PIN. Please try again.'
      } else if (err.response?.data?.message) {
        error.value = err.response.data.message
      } else {
        error.value = 'Unable to connect to the server. Please check your connection.'
      }
      return false
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    token.value = null
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('employeeId')
    error.value = null
  }

  const clearError = () => {
    error.value = null
  }

  const isAuthenticated = () => {
    return token.value !== null
  }

  return {
    login,
    logout,
    clearError,
    isAuthenticated,
    loading,
    error,
    token
  }
}
