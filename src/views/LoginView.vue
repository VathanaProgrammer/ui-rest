<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Eye, EyeOff } from 'lucide-vue-next'
import { useLogin } from '../composables/useLogin'

const router = useRouter()
const { login, loading, error, clearError } = useLogin()

const employeeId = ref('')
const accessPin = ref('')
const showPin = ref(false)
const operationalStatus = ref({
  kitchen: { status: 'Active', color: 'bg-green-500' },
  terminal: { status: 'Secure', color: 'bg-blue-500' }
})

const isFormValid = computed(() => {
  return employeeId.value.trim().length > 0 && accessPin.value.length >= 4
})

const handleLogin = async () => {
  clearError()
  
  if (!isFormValid.value) {
    return
  }

  const success = await login({
    employeeId: employeeId.value,
    accessPin: accessPin.value
  })

  if (success) {
    // Clear form
    employeeId.value = ''
    accessPin.value = ''
    // Navigate to dashboard
    router.push('/tables')
  }
}

const handleForgotPin = () => {
  // TODO: Implement forgot PIN flow
  console.log('Forgot PIN clicked')
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && isFormValid.value) {
    handleLogin()
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
    <!-- Animated background elements -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div class="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style="animation-delay: 2s"></div>
    </div>

    <!-- Main login card -->
    <div class="relative z-10 w-full max-w-md">
      <div class="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl bg-opacity-90">
        <!-- Header -->
        <div class="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
          <h1 class="text-3xl font-bold text-white mb-2">HEKS v2.0</h1>
          <p class="text-blue-100 text-sm">Staff Login</p>
          <p class="text-blue-100 text-xs mt-1 opacity-80">Enter your credentials to access the station.</p>
        </div>

        <!-- Form content -->
        <div class="px-8 py-8">
          <!-- Error message -->
          <div v-if="error" class="mb-6 p-4 bg-red-500 bg-opacity-20 border border-red-500 border-opacity-50 rounded-lg">
            <p class="text-red-300 text-sm font-medium">{{ error }}</p>
          </div>

          <!-- Employee ID field -->
          <div class="mb-6">
            <label class="block text-slate-300 text-sm font-semibold mb-3">Employee ID</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg class="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
              </div>
              <input
                v-model="employeeId"
                type="text"
                placeholder="e.g. 88294"
                @keydown="handleKeydown"
                class="w-full pl-12 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition duration-200"
              />
            </div>
          </div>

          <!-- Access PIN field -->
          <div class="mb-2">
            <label class="block text-slate-300 text-sm font-semibold mb-3">Access PIN</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg class="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
              </div>
              <input
                v-model="accessPin"
                :type="showPin ? 'text' : 'password'"
                placeholder="Enter PIN"
                @keydown="handleKeydown"
                class="w-full pl-12 pr-12 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition duration-200"
              />
              <button
                type="button"
                @click="showPin = !showPin"
                class="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-300 transition"
              >
                <Eye v-if="!showPin" :size="20" />
                <EyeOff v-else :size="20" />
              </button>
            </div>
          </div>

          <!-- Forgot PIN link -->
          <div class="mb-8 text-right">
            <button
              @click="handleForgotPin"
              class="text-blue-400 hover:text-blue-300 text-sm font-medium transition duration-200"
            >
              Forgot PIN?
            </button>
          </div>

          <!-- Login button -->
          <button
            @click="handleLogin"
            :disabled="!isFormValid || loading"
            class="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center gap-2"
          >
            <svg v-if="!loading" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"></path>
            </svg>
            <svg v-else class="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ loading ? 'Logging In...' : 'Clock In / Login' }}
          </button>
        </div>

        <!-- Operational Status Footer -->
        <div class="bg-slate-900 px-8 py-6 border-t border-slate-700">
          <p class="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-3">Operational Status</p>
          <div class="flex gap-6">
            <div class="flex items-center gap-2">
              <div :class="[operationalStatus.kitchen.color, 'w-2 h-2 rounded-full']"></div>
              <span class="text-slate-300 text-sm">Kitchen 01: {{ operationalStatus.kitchen.status }}</span>
            </div>
            <div class="flex items-center gap-2">
              <div :class="[operationalStatus.terminal.color, 'w-2 h-2 rounded-full']"></div>
              <span class="text-slate-300 text-sm">Terminal: {{ operationalStatus.terminal.status }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer info -->
      <div class="text-center mt-6 text-slate-400 text-xs">
        <p class="mb-2">HEKS Systems • System Status: <span class="text-green-400">Online</span></p>
        <div class="flex justify-center gap-4 text-slate-500">
          <a href="#" class="hover:text-slate-300 transition">Support</a>
          <span>•</span>
          <a href="#" class="hover:text-slate-300 transition">Privacy Policy</a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

:deep(.glass-card) {
  animation: fadeIn 0.5s ease-out;
}
</style>
