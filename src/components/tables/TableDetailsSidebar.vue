<script setup lang="ts">
import { X, Printer, Ban, User, ChevronLeft, ChevronRight } from 'lucide-vue-next';
import { ref } from 'vue';
import type { Table } from '../../types';

defineProps<{
  table: Table | null;
}>();

defineEmits(['close']);

const isCollapsed = ref(false);
</script>

<template>
  <div :class="['bg-[#0f172a] border-l border-[#1e293b] flex flex-col h-full relative transition-all duration-300', isCollapsed ? 'w-12' : 'w-80']">
    
    <!-- Collapse Toggle -->
    <button 
      v-if="table"
      @click="isCollapsed = !isCollapsed" 
      class="absolute -left-3 top-6 bg-blue-600 rounded-full p-1 text-white hover:bg-blue-500 transition shadow-lg z-50">
      <component :is="isCollapsed ? 'ChevronLeft' : 'ChevronRight'" class="w-4 h-4" />
    </button>

    <div v-if="!table" class="flex-1 flex items-center justify-center text-slate-500 text-center px-2">
      <span v-if="!isCollapsed">Select a table</span>
      <span v-else>...</span>
    </div>
    
    <template v-else>
      <!-- Header -->
      <div class="p-6 border-b border-[#1e293b]" :class="{'p-3': isCollapsed}">
        <div class="flex justify-between items-start mb-4" :class="{'flex-col items-center gap-2': isCollapsed}">
          <h2 v-if="!isCollapsed" class="text-white font-semibold text-lg">Table Details</h2>
          <button v-if="!isCollapsed" @click="$emit('close')" class="text-slate-400 hover:text-white transition-colors">
            <X class="w-5 h-5" />
          </button>
        </div>
        
        <div class="bg-[#1e293b] rounded-xl p-4 flex justify-between items-center border border-slate-700/50" :class="{'p-2 justify-center': isCollapsed}">
          <div :class="{'text-center': isCollapsed}">
            <div class="text-red-500 font-bold text-2xl mb-1" :class="{'text-lg': isCollapsed}">{{ table.number }}</div>
            <div v-if="!isCollapsed" class="text-slate-400 text-[13px] leading-relaxed mt-2">
              <div>Current Guests: {{ table.guests || 0 }} /</div>
              <div>Max Capacity: {{ table.capacity }}</div>
            </div>
          </div>
          <div v-if="table.waitTime && !isCollapsed" class="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded">
            {{ table.waitTime }}m
          </div>
        </div>
      </div>

      <!-- Content -->
      <div v-if="!isCollapsed" class="flex-1 overflow-auto p-6">
        <!-- Current Order -->
        <div class="mb-8">
          <h3 class="text-slate-400 text-xs font-semibold tracking-widest uppercase mb-4">Current Order</h3>
          <ul class="space-y-3">
            <li v-for="item in table.currentOrder" :key="item.id" class="flex justify-between items-start">
              <div>
                <div class="text-white font-medium text-sm">{{ item.name }}</div>
                <div v-if="item.notes" class="text-slate-500 text-xs italic">+ {{ item.notes }}</div>
              </div>
              <div class="text-white text-sm font-medium">${{ item.price.toFixed(2) }}</div>
            </li>
          </ul>
        </div>

        <!-- Staff Assigned -->
        <div>
          <h3 class="text-slate-400 text-xs font-semibold tracking-widest uppercase mb-4">Staff Assigned</h3>
          <div class="bg-[#1e293b] rounded-xl p-3 flex items-center gap-3 border border-slate-700/50">
            <img 
              v-if="table.staffAssigned"
              :src="`https://i.pravatar.cc/150?u=${table.staffAssigned.name}`" 
              :alt="table.staffAssigned.name" 
              class="w-10 h-10 rounded-full border border-slate-600 object-cover" 
            />
            <div v-else class="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-slate-400">
              <User class="w-5 h-5" />
            </div>
            <div>
              <div class="text-white font-medium text-sm">{{ table.staffAssigned?.name }}</div>
              <div class="text-slate-400 text-xs">{{ table.staffAssigned?.role }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer Actions -->
      <div v-if="!isCollapsed" class="p-6 border-t border-[#1e293b] space-y-3 bg-[#0b1121]">
        <button class="w-full bg-blue-100 hover:bg-blue-200 text-blue-900 font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors">
          <Printer class="w-5 h-5" />
          Print Bill
        </button>
        <button class="w-full bg-transparent border border-red-900/50 hover:bg-red-900/20 text-red-500 font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors">
          <Ban class="w-5 h-5" />
          Void Table
        </button>
      </div>
    </template>
  </div>
</template>
