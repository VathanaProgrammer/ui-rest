<script setup lang="ts">
import CategoryTableRow from './CategoryTableRow.vue';
import type { Category } from './types';

defineProps<{
  categories: Category[];
}>();

defineEmits<{
  (e: 'edit', id: number): void;
  (e: 'delete', id: number): void;
  (e: 'toggle-status', id: number): void;
}>();
</script>

<template>
  <div class="table-wrapper">
    <table class="cat-table">
      <thead>
        <tr>
          <th class="col-check"><span class="checkbox" /></th>
          <th class="col-name">CATEGORY NAME</th>
          <th class="col-count">ITEM COUNT</th>
          <th class="col-status">STATUS</th>
          <th class="col-order">DISPLAY ORDER</th>
          <th class="col-actions">ACTIONS</th>
        </tr>
      </thead>

      <tbody>
        <CategoryTableRow
          v-for="cat in categories"
          :key="cat.id"
          :category="cat"
          @edit="$emit('edit', $event)"
          @delete="$emit('delete', $event)"
          @toggle-status="$emit('toggle-status', $event)"
        />
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.table-wrapper {
  width: 100%;
  overflow-x: auto;
}

.cat-table {
  width: 100%;
  border-collapse: collapse;
}

.cat-table thead tr {
  border-bottom: 1px solid #1e293b;
}
.cat-table thead th {
  padding: 1rem 1.25rem;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: #475569;
  text-align: left;
}

/* Column sizing — mirrors CategoryTableRow */
.col-check   { width: 3rem; }
.col-name    { min-width: 14rem; }
.col-count   { width: 7rem; text-align: center; }
.col-status  { width: 10rem; }
.col-order   { width: 8rem; text-align: center; }
.col-actions { width: 7rem; text-align: right; }

.checkbox {
  display: inline-block;
  width: 1rem;
  height: 1rem;
  border: 1.5px solid #334155;
  border-radius: 0.25rem;
  background: transparent;
  cursor: pointer;
}
</style>