<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { Search } from 'lucide-vue-next';

const currentTime = ref('');

let timer: number;
const updateTime = () => {
  const now = new Date();
  currentTime.value = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
};

onMounted(() => {
  updateTime();
  timer = setInterval(updateTime, 1000) as unknown as number;
});

onUnmounted(() => {
  clearInterval(timer);
});
</script>

<template>
  <header class="h-20 border-b border-[#1e293b] flex items-center justify-between px-8 bg-[#0b1121]">
    <!-- Left side -->
    <div class="flex items-center gap-8">
      <h1 class="text-white font-bold tracking-widest text-xl">HEKS v2.0</h1>
      <div class="flex items-center gap-3">
        <span class="text-blue-500 font-semibold text-xs tracking-wider uppercase bg-blue-500/10 px-2 py-1 rounded">Live</span>
        <span class="text-white text-2xl font-semibold tracking-wider font-mono">{{ currentTime }}</span>
      </div>
    </div>

    <!-- Right side -->
    <div>
      <div class="relative">
        <Search class="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
        <input 
          type="text" 
          placeholder="Search tables" 
          class="bg-[#1e293b] text-sm text-white placeholder-slate-500 pl-10 pr-4 py-2.5 rounded-full border border-slate-700/50 focus:outline-none focus:border-slate-600 focus:bg-slate-800 transition-colors w-64"
        />
      </div>
    </div>
  </header>
</template>
