<script setup lang="ts">
import type { Table } from '../../types';
import Skeleton from '../ui/Skeleton.vue';

defineProps<{
  tables: Table[];
  floors?: string[];
  activeFloor?: string;
  selectedTableId: string | null;
  loading?: boolean;
}>();

defineEmits(['select', 'change-floor']);

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
  <div class="relative w-full h-[600px] border border-[#1e293b] rounded-xl overflow-y-auto bg-[#0a0f1c] p-4 md:p-8 flex flex-col items-center">
    <!-- Top Filter Tabs -->
    <div v-if="floors && floors.length > 0" class="self-start bg-[#1e293b] rounded-lg p-1 flex flex-wrap gap-1 shadow-lg mb-8 md:mb-12">
      <button 
        v-for="floor in floors" 
        :key="floor"
        @click="$emit('change-floor', floor)"
        :class="activeFloor === floor 
          ? 'bg-blue-100 text-blue-800 px-4 py-1.5 rounded-md text-sm font-semibold'
          : 'text-slate-400 px-4 py-1.5 rounded-md text-sm font-medium hover:text-white transition-colors'"
      >
        {{ floor }}
      </button>
    </div>

    <!-- The Tables Grid -->
    <div class="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-x-4 sm:gap-x-8 md:gap-x-12 gap-y-10 sm:gap-y-16 max-w-4xl w-full mx-auto">
      
      <!-- Loading Skeleton -->
      <template v-if="loading">
        <div v-for="i in 8" :key="'skeleton-'+i" class="flex flex-col items-center">
          <Skeleton class="w-24 h-24 sm:w-32 sm:h-32 rounded-xl shadow-xl border-b-[5px] border-slate-800" />
          <Skeleton class="h-4 w-20 mt-4" />
        </div>
      </template>

      <!-- Actual Tables -->
      <template v-else>
        <div 
          v-for="table in tables" 
          :key="table.id"
          class="flex flex-col items-center"
        >
          <button
            @click="$emit('select', table)"
            class="relative w-24 h-24 sm:w-32 sm:h-32 rounded-xl flex items-center justify-center transition-transform hover:scale-105 shadow-xl border-b-[5px] border-black/30 text-black font-bold tracking-wider"
            :class="[
              getBgColor(table.status),
              selectedTableId === table.id ? 'ring-4 ring-white ring-offset-4 ring-offset-[#0a0f1c]' : ''
            ]"
          >
            <!-- Seats Badge -->
            <div class="absolute top-2 right-2 px-1.5 py-0.5 rounded shadow text-[9px] font-bold tracking-widest text-white/90 bg-black/20 uppercase backdrop-blur-sm border border-white/10">
              {{ table.capacity }} SEATS
            </div>

            <!-- Table Number -->
            <span class="text-3xl sm:text-4xl opacity-90">{{ table.number }}</span>
          </button>
          
          <!-- Table Label -->
          <span class="mt-4 text-slate-400 text-[13px] font-semibold tracking-[0.2em] uppercase">Table {{ table.number }}</span>
        </div>
      </template>
    </div>
  </div>
</template>
