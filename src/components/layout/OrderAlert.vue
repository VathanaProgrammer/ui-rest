<script setup lang="ts">
import { useOrderAlert } from '../../composables/useOrderAlert'

const { activeAlert, dismissAlert } = useOrderAlert()
</script>

<template>
  <Transition name="slide-fade">
    <div v-if="activeAlert" class="global-alert-overlay pointer-events-none fixed inset-0 z-50 flex items-start justify-end p-6">
      <!-- Alert Card -->
      <div class="pointer-events-auto w-full max-w-sm rounded-xl border-2 border-blue-500/50 bg-[#1e293b] p-4 shadow-2xl backdrop-blur-xl">
        
        <!-- Header -->
        <div class="flex items-start justify-between">
          <div class="flex items-center gap-3">
            <div class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-500">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <div>
              <h3 class="text-sm font-bold text-white">{{ activeAlert.title }}</h3>
              <p class="text-xs font-semibold tracking-wider text-gray-400">{{ activeAlert.timeText || 'JUST NOW' }}</p>
            </div>
          </div>
          <button @click="dismissAlert" class="text-gray-400 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>

        <!-- Body -->
        <div class="mt-4 rounded-lg bg-[#0f172a]/50 p-4">
          <div class="flex items-center justify-between border-b border-gray-700/50 pb-3">
            <span class="text-lg font-bold text-emerald-400">{{ activeAlert.table || 'N/A' }}</span>
            <span class="rounded bg-gray-800 px-2 py-1 text-xs font-bold text-gray-300">
              {{ activeAlert.guests || 1 }} GUESTS
            </span>
          </div>
          
          <div class="mt-3">
            <p class="text-xs font-semibold tracking-wider text-gray-400 uppercase">
              {{ activeAlert.orderType || 'PRE-ORDER' }}
            </p>
            <p class="mt-1 text-sm font-medium text-white">
              {{ activeAlert.orderName || 'Details not specified' }}
            </p>
          </div>
        </div>

        <!-- Actions -->
        <div class="mt-4 flex gap-3">
          <button 
            @click="activeAlert?.onAction ? activeAlert.onAction() : dismissAlert()" 
            class="flex-1 rounded-lg bg-[#c7d2fe] py-2.5 text-xs font-bold uppercase tracking-wider text-[#3730a3] transition-colors hover:bg-indigo-200">
            {{ activeAlert.actionLabel || 'VIEW ORDER' }}
          </button>
          <button 
            @click="dismissAlert"
            class="flex-1 rounded-lg bg-gray-800 py-2.5 text-xs font-bold uppercase tracking-wider text-gray-300 transition-colors hover:bg-gray-700">
            DISMISS
          </button>
        </div>
        
      </div>
    </div>
  </Transition>
</template>

<style scoped>
/* Smooth slide and fade animation matching modern UI */
.slide-fade-enter-active {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.slide-fade-leave-active {
  transition: all 0.3s ease-in;
}
.slide-fade-enter-from {
  transform: translateX(100px);
  opacity: 0;
}
.slide-fade-leave-to {
  transform: translateX(100px);
  opacity: 0;
}
</style>
