<script setup lang="ts">
import { useGlobalLoader } from '../../composables/useGlobalLoader';

const { isLoading } = useGlobalLoader();
</script>

<template>
  <Teleport to="body">
    <transition 
      enter-active-class="transition opacity-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition opacity-300"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="isLoading" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] flex flex-col items-center justify-center">
        <!-- Spinner -->
        <div class="relative w-24 h-24 mb-6">
          <div class="absolute inset-0 border-4 border-slate-700 rounded-full"></div>
          <div class="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
          <div class="absolute inset-0 border-4 border-emerald-500 rounded-full border-b-transparent animate-spin" style="animation-direction: reverse; animation-duration: 1.5s;"></div>
        </div>
        
        <!-- Text -->
        <div class="flex flex-col items-center space-y-2">
          <p class="text-white font-bold tracking-[0.2em] uppercase text-lg animate-pulse">Loading Data</p>
          <p class="text-blue-400 text-xs font-medium tracking-widest uppercase">Please wait...</p>
        </div>
      </div>
    </transition>
  </Teleport>
</template>
