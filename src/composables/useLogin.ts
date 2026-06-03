import axios from 'axios'
import { ref } from 'vue'

interface LoginCredentials {
  employeeId: string
  accessPin: string
}

interface LoginResponse {
  success: boolean
  token?: string
  message?: string
}

export function useLogin() {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const token = ref<string | null>(localStorage.getItem('authToken') || null)

  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:7444/api'

//   const login = async (credentials: LoginCredentials): Promise<boolean> => {
//     loading.value = true
//     error.value = null

//     try {
//       const response = await axios.post<LoginResponse>(
//         `${baseUrl}/auth/login`,
//         {
//           employeeId: credentials.employeeId,
//           accessPin: credentials.accessPin
//         }
//       )

//       if (response.data.success && response.data.token) {
//         token.value = response.data.token
//         localStorage.setItem('authToken', response.data.token)
//         localStorage.setItem('employeeId', credentials.employeeId)
//         return true
//       } else {
//         error.value = response.data.message || 'Login failed. Please check your credentials.'
//         return false
//       }
//     } catch (err: any) {
//       // Handle different error scenarios
//       if (err.response?.status === 401) {
//         error.value = 'Invalid Employee ID or PIN. Please try again.'
//       } else if (err.response?.status === 429) {
//         error.value = 'Too many login attempts. Please try again later.'
//       } else if (err.response?.data?.message) {
//         error.value = err.response.data.message
//       } else {
//         error.value = 'Unable to connect to the server. Please check your connection.'
//       }
//       return false
//     } finally {
//       loading.value = false
//     }
//   }
  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    loading.value = true
    error.value = null

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800))

    // Static credentials — change these to whatever you want
    const STATIC_USERS = [
        { employeeId: 'EMP001', accessPin: '1234' },
        { employeeId: '88294',  accessPin: '0000' },
    ]

    const match = STATIC_USERS.find(
        u => u.employeeId === credentials.employeeId && u.accessPin === credentials.accessPin
    )

    if (match) {
        const fakeToken = 'static-token-' + match.employeeId
        token.value = fakeToken
        localStorage.setItem('authToken', fakeToken)
        localStorage.setItem('employeeId', credentials.employeeId)
        loading.value = false
        return true
    } else {
        error.value = 'Invalid Employee ID or PIN. Please try again.'
        loading.value = false
        return false
    }
    }

  const logout = () => {
    token.value = null
    localStorage.removeItem('authToken')
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
