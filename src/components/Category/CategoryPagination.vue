<script setup lang="ts">
import { ChevronLeft, ChevronRight } from 'lucide-vue-next';
import type { PaginationInfo } from './types';

defineProps<{
  pagination: PaginationInfo;
}>();

defineEmits<{
  (e: 'page-change', page: number): void;
}>();
</script>

<template>
  <div class="pagination-bar">
    <span class="pag-info">
      Showing {{ pagination.showing }} of {{ pagination.totalItems }} categories
    </span>

    <div class="pag-controls">
      <!-- Prev -->
      <button
        class="pag-btn pag-arrow"
        :disabled="pagination.current === 1"
        @click="$emit('page-change', pagination.current - 1)"
      >
        <ChevronLeft class="pag-icon" />
      </button>

      <!-- Page numbers -->
      <button
        v-for="page in pagination.total"
        :key="page"
        class="pag-btn pag-num"
        :class="page === pagination.current ? 'pag-active' : ''"
        @click="$emit('page-change', page)"
      >
        {{ page }}
      </button>

      <!-- Next -->
      <button
        class="pag-btn pag-arrow"
        :disabled="pagination.current === pagination.total"
        @click="$emit('page-change', pagination.current + 1)"
      >
        <ChevronRight class="pag-icon" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.pagination-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  border-top: 1px solid #1e293b;
}
.pag-info {
  font-size: 0.8rem;
  color: #64748b;
}
.pag-controls {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}
.pag-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 2rem;
  height: 2rem;
  border-radius: 0.4rem;
  border: none;
  background: #1e293b;
  color: #94a3b8;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  padding: 0 0.4rem;
  transition: background 0.15s, color 0.15s;
}
.pag-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}
.pag-btn:not(:disabled):hover {
  background: #2d3f55;
  color: #e2e8f0;
}
.pag-active {
  background: #2563eb !important;
  color: #fff !important;
}
.pag-arrow {
  color: #64748b;
}
.pag-icon {
  width: 0.85rem;
  height: 0.85rem;
}
</style>