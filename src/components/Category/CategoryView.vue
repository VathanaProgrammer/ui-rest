<script setup lang="ts">
import { ref, computed } from 'vue';
import CategoryHeader from './CategoryHeader.vue';
import CategoryTable from './CategoryTable.vue';
import CategoryPagination from './CategoryPagination.vue';
import CategoryModal from './CategoryModal.vue';
import { breadcrumbs, mockCategories } from './categoryData';
import type { Category, PaginationInfo } from './types';

// ── Constants ─────────────────────────────────────────────────────────
const PAGE_SIZE = 5;

// ── State ─────────────────────────────────────────────────────────────
const showModal    = ref(false);
const editCategory = ref<Category | null>(null);
const categories   = ref<Category[]>([...mockCategories]);
const currentPage  = ref(1);

// ── Derived pagination ────────────────────────────────────────────────
const totalItems = computed(() => categories.value.length);
const totalPages = computed(() => Math.max(1, Math.ceil(totalItems.value / PAGE_SIZE)));

const pagedCategories = computed(() => {
  const start = (currentPage.value - 1) * PAGE_SIZE;
  return categories.value.slice(start, start + PAGE_SIZE);
});

const pagination = computed<PaginationInfo>(() => {
  const start = (currentPage.value - 1) * PAGE_SIZE + 1;
  const end   = Math.min(currentPage.value * PAGE_SIZE, totalItems.value);
  return {
    current:    currentPage.value,
    total:      totalPages.value,
    showing:    totalItems.value === 0 ? '0' : `${start}-${end}`,
    totalItems: totalItems.value,
  };
});

// ── Helpers ───────────────────────────────────────────────────────────
// After deleting rows, clamp page so we never show an empty page
const clampPage = () => {
  if (currentPage.value > totalPages.value) {
    currentPage.value = totalPages.value;
  }
};

// ── Handlers ──────────────────────────────────────────────────────────
const handleAdd = () => {
  editCategory.value = null;
  showModal.value    = true;
};

const handleEdit = (id: number) => {
  editCategory.value = categories.value.find(c => c.id === id) ?? null;
  showModal.value    = true;
};

const handleModalSubmit = (newCat: Omit<Category, 'id'>) => {
  const nextId    = categories.value.length + 1;
  const nextOrder = String(nextId).padStart(2, '0');

  categories.value.push({
    ...newCat,
    id:           nextId,
    displayOrder: newCat.displayOrder && newCat.displayOrder !== '—' ? newCat.displayOrder : nextOrder,
  });

  // Jump to last page so the user sees the new row
  currentPage.value = totalPages.value;
};

const handleModalUpdate = (updated: Category) => {
  const idx = categories.value.findIndex(c => c.id === updated.id);
  if (idx !== -1) categories.value[idx] = updated;
};

const handleDelete = (id: number) => {
  categories.value = categories.value.filter(c => c.id !== id);
  clampPage();
};

const handleToggleStatus = (id: number) => {
  const cat = categories.value.find(c => c.id === id);
  if (cat) cat.status = cat.status === 'active' ? 'inactive' : 'active';
};

const handlePageChange = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

const handleClose = () => {
  showModal.value    = false;
  editCategory.value = null;
};
</script>

<template>
  <div class="category-page">

    <CategoryHeader
      :breadcrumbs="breadcrumbs"
      title="Category Management"
      @add="handleAdd"
    />

    <div class="table-card">
      <CategoryTable
        :categories="pagedCategories"
        @edit="handleEdit"
        @delete="handleDelete"
        @toggle-status="handleToggleStatus"
      />

      <CategoryPagination
        :pagination="pagination"
        @page-change="handlePageChange"
      />
    </div>

    <CategoryModal
      :show="showModal"
      :edit-category="editCategory"
      @close="handleClose"
      @submit="handleModalSubmit"
      @update="handleModalUpdate"
    />

  </div>
</template>

<style scoped>
.category-page {
  padding: 2rem 2.5rem;
  min-height: 100%;
  background: #0b1120;
  font-family: 'DM Sans', 'Segoe UI', sans-serif;
  color: #e2e8f0;
}

.table-card {
  background: #0f172a;
  border: 1px solid #1e293b;
  border-radius: 0.75rem;
  overflow: hidden;
}
</style>