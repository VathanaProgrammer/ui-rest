<script setup lang="ts">
import type { Table } from '../../types';

defineProps<{
  tables: Table[];
  selectedTableId: string | null;
}>();

defineEmits(['select']);

const getBgColor = (status: string) => {
  switch (status) {
    case 'occupied': return 'bg-red-500';
    case 'available': return 'bg-emerald-500';
    case 'wait': return 'bg-amber-600';
    case 'cleaning': return 'bg-blue-400';
    default: return 'bg-slate-600';
  }
};
</script>

<template>
  <div class="relative w-full h-[600px] border border-[#1e293b] rounded-xl overflow-hidden bg-[#0a0f1c]">
    <!-- Top Filter Tabs -->
    <div class="absolute top-4 left-4 bg-[#1e293b] rounded-lg p-1 flex shadow-lg">
      <button class="bg-blue-100 text-blue-800 px-4 py-1.5 rounded-md text-sm font-semibold">Main Dining</button>
      <button class="text-slate-400 px-4 py-1.5 rounded-md text-sm font-medium hover:text-white transition-colors">Terrace</button>
      <button class="text-slate-400 px-4 py-1.5 rounded-md text-sm font-medium hover:text-white transition-colors">Private Room</button>
    </div>

    <!-- The Tables -->
    <button
      v-for="table in tables"
      :key="table.id"
      @click="$emit('select', table)"
      class="absolute rounded-xl flex flex-col items-center justify-center transition-transform hover:scale-105 shadow-xl border-b-4 border-black/30 text-black font-bold tracking-wider"
      :class="[
        getBgColor(table.status),
        selectedTableId === table.id ? 'ring-4 ring-white ring-offset-4 ring-offset-[#0a0f1c]' : ''
      ]"
      :style="{
        left: `${table.x}px`,
        top: `${table.y}px`,
        width: `${table.width}px`,
        height: `${table.height}px`,
      }"
    >
      <!-- Optional top indicator (e.g. lamp or chair) -->
      <div v-if="table.number === '03'" class="absolute -top-3 w-4 h-3 bg-amber-700 rounded-t-full"></div>
      
      <!-- Guest indicators (chairs) left -->
      <div v-if="table.number === 'T-10'" class="absolute -left-3 top-1/2 -translate-y-1/2 w-3 h-8 bg-slate-700 rounded-l-full"></div>
      <!-- Guest indicators (chairs) right -->
      <div v-if="table.number === 'T-10'" class="absolute -right-3 top-1/2 -translate-y-1/2 w-3 h-8 bg-slate-700 rounded-r-full"></div>
      <!-- Guest indicators (chairs) bottom -->
      <div v-if="table.number === 'T-10'" class="absolute -bottom-3 left-1/2 -translate-x-1/2 w-8 h-3 bg-slate-700 rounded-b-full"></div>

      <!-- Guests count badge -->
      <div v-if="table.guests" class="absolute -top-3 -right-3 bg-slate-700 text-white text-[10px] px-1.5 py-0.5 rounded shadow flex items-center gap-1">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
        </svg>
        {{ table.guests }}
      </div>

      <!-- Wait time badge -->
      <div v-if="table.waitTime" class="absolute -bottom-2 -right-2 bg-red-900 text-white text-[10px] px-1.5 py-0.5 rounded shadow font-bold">
        {{ table.waitTime }}m
      </div>

      <span class="text-xl opacity-90">{{ table.number }}</span>
      <div v-if="table.status === 'occupied' && table.guests" class="flex gap-1 mt-1 opacity-60">
        <svg v-for="i in table.guests" :key="i" xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
        </svg>
      </div>
    </button>

    <!-- Communal Zone Indicator (Bottom) -->
    <div class="absolute bottom-8 left-1/2 -translate-x-1/2 bg-[#1e293b] rounded-lg p-2 flex items-center gap-2 border border-slate-700/50">
      <div class="w-8 h-6 bg-red-500 rounded text-[10px] font-bold text-center leading-6 text-black/50">C1</div>
      <div class="w-8 h-6 bg-red-500 rounded text-[10px] font-bold text-center leading-6 text-black/50">C2</div>
      <span class="text-slate-400 text-xs font-semibold px-2 uppercase tracking-widest">Communal Zone</span>
      <div class="w-8 h-6 bg-emerald-500 rounded text-[10px] font-bold text-center leading-6 text-black/50">C4</div>
      <div class="w-8 h-6 bg-emerald-500 rounded text-[10px] font-bold text-center leading-6 text-black/50">C5</div>
    </div>
    
    <!-- Legend -->
    <div class="absolute bottom-4 right-4 bg-[#1e293b] rounded-lg p-2 flex gap-4 border border-slate-700/50">
       <div class="flex items-center gap-2">
         <div class="w-3 h-3 rounded-full bg-emerald-500"></div>
         <span class="text-slate-400 text-xs">Avail</span>
       </div>
    </div>
  </div>
</template>
