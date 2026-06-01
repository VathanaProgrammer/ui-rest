<script setup lang="ts">
// In a real app, these stats would be fetched from the API
const stats = [
  { label: 'OCCUPANCY', value: '82%', subtext: '↑ 12%', subtextColor: 'text-green-500' },
  { label: 'WAIT TIME', value: '18m', subtext: 'avg', subtextColor: 'text-slate-500' },
  { label: 'ACTIVE COVERS', value: '142', subtext: '/ 180', subtextColor: 'text-slate-500' },
  { label: 'READY TABLES', value: '12', subtext: 'units', subtextColor: 'text-slate-500' },
];
</script>

<template>
  <div class="grid grid-cols-4 gap-4 mb-6">
    <div 
      v-for="(stat, index) in stats" 
      :key="index"
      class="bg-[#0f172a] border border-[#1e293b] rounded-xl p-4 flex flex-col justify-between"
    >
      <span class="text-slate-400 text-xs font-semibold tracking-widest uppercase mb-2">{{ stat.label }}</span>
      <div class="flex items-baseline gap-2">
        <span class="text-white text-3xl font-bold" :class="index === 1 ? 'text-amber-500' : index === 3 ? 'text-emerald-500' : ''">{{ stat.value }}</span>
        <span class="text-sm font-medium" :class="stat.subtextColor">{{ stat.subtext }}</span>
      </div>
    </div>
  </div>
</template>
