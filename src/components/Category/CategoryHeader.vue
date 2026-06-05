<script setup lang="ts">
import { Plus } from 'lucide-vue-next';
import type { Breadcrumb } from './types';

defineProps<{
  breadcrumbs: Breadcrumb[];
  title: string;
}>();

defineEmits<{
  (e: 'add'): void;
}>();
</script>

<template>
  <div class="page-header">
    <!-- Breadcrumb -->
    <div class="breadcrumb">
      <span
        v-for="(crumb, i) in breadcrumbs"
        :key="crumb.path"
        class="breadcrumb-item"
      >
        <span :class="i < breadcrumbs.length - 1 ? 'crumb-link' : 'crumb-active'">
          {{ crumb.label }}
        </span>
        <span v-if="i < breadcrumbs.length - 1" class="crumb-sep">›</span>
      </span>
    </div>

    <!-- Title + Button -->
    <div class="header-row">
      <h1 class="page-title">{{ title }}</h1>
      <button class="btn-add" @click="$emit('add')">
        <Plus class="btn-icon" />
        ADD CATEGORY
      </button>
    </div>
  </div>
</template>

<style scoped>
.page-header {
  margin-bottom: 2rem;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  margin-bottom: 0.5rem;
  color: #64748b;
}
.breadcrumb-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}
.crumb-link {
  color: #64748b;
  cursor: pointer;
}
.crumb-link:hover {
  color: #94a3b8;
}
.crumb-active {
  color: #cbd5e1;
  font-weight: 500;
}
.crumb-sep {
  color: #334155;
}

.header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.page-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #f1f5f9;
  letter-spacing: -0.02em;
}

.btn-add {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 0.5rem;
  padding: 0.65rem 1.25rem;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  cursor: pointer;
  transition: background 0.15s;
}
.btn-add:hover {
  background: #1d4ed8;
}
.btn-icon {
  width: 1rem;
  height: 1rem;
}
</style>