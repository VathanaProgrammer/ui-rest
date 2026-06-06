<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import CategoryHeader from './CategoryHeader.vue';
import CategoryTable from './CategoryTable.vue';
import CategoryPagination from './CategoryPagination.vue';
import CategoryModal from './CategoryModal.vue';
import { breadcrumbs } from './categoryData';
import type { Category, PaginationInfo } from './types';
import api from '../../utils/api.ts';

// ── Constants ─────────────────────────────────────────────────────────
const PAGE_SIZE = 5;

// ── State ─────────────────────────────────────────────────────────────
const showModal    = ref(false);
const editCategory = ref<Category | null>(null);
const currentPage  = ref(1);
const categories   = ref<Category[]>([]);

// ── API: Fetch all categories ─────────────────────────────────────────
const getCategories = async () => {
  try {
    const response = await api.get('/categories');
    if (response.status === 1 && Array.isArray(response.data)) {
      categories.value = response.data.map((item: any) => ({
       id:           item.id,
      name:         item.categoryName || item.name,
      displayOrder: item.displayOrder != null ? String(item.displayOrder) : '—',
      status:       item.isActive === true || item.status === 'active' ? 'active' : 'inactive',
      iconColor:    item.iconColor || '#94a3b8',  // fixed typo (was iconClor)
      imageUrl:     item.imageUrl  || '',          // maps correctly now
      }));
    } else {
      console.error('Failed to load categories:', response.message);
    }
  } catch (err) {
    console.error('Failed to fetch categories:', err);
  }
};

// ── API: Delete category ──────────────────────────────────────────────
const handleDelete = async (id: number) => {
  if (!confirm('Are you sure you want to delete this category?')) return;
  try {
    const response = await api.delete(`/categories/${id}`);
    if (response.status === 1) {
      categories.value = categories.value.filter(c => c.id !== id);
      clampPage();
    } else {
      alert(response.message || 'Failed to delete category.');
    }
  } catch (err) {
    console.error('Delete failed:', err);
    alert('Something went wrong. Please try again.');
  }
};

// ── API: Toggle status ────────────────────────────────────────────────

const handleToggleStatus = async (id: number) => {
  const cat = categories.value.find(c => c.id === id);
  if (!cat) return;

  const newStatus = cat.status === 'active' ? 'inactive' : 'active';

  try {
    const response = await api.put(`/categories/${id}`, {
      categoryName: cat.name,
      // convert displayOrder back to number for API, or null if '—'
      displayOrder: cat.displayOrder && cat.displayOrder !== '—' 
                    ? Number(cat.displayOrder) 
                    : null,
      isActive:     newStatus === 'active',
      iconColor:    cat.iconColor,
      imageUrl:     cat.imageUrl || null,
    });

    if (response.status === 1) {
      cat.status = newStatus;
    } else {
      alert(response.message || 'Failed to update status.');
    }
  } catch (err) {
    console.error('Toggle status failed:', err);
    alert('Something went wrong. Please try again.');
  }
};

// Fix handleModalUpdate — splice triggers Vue reactivity properly
const handleModalUpdate = (updated: Category) => {
  const idx = categories.value.findIndex(c => c.id === updated.id);
  if (idx !== -1) {
    // splice instead of direct assignment so Vue detects the change
    categories.value.splice(idx, 1, updated);
  }
};

onMounted(() => {
  getCategories();
});

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

// Edit: just opens the modal — API call happens inside CategoryModal
const handleEdit = (id: number) => {
  editCategory.value = categories.value.find(c => c.id === id) ?? null;
  showModal.value    = true;
};

// Modal emits full Category object with real id from API
const handleModalSubmit = (newCat: Category) => {
  categories.value.push(newCat);
  currentPage.value = totalPages.value;
};

// const handleModalUpdate = (updated: Category) => {
//   const idx = categories.value.findIndex(c => c.id === updated.id);
//   if (idx !== -1) categories.value[idx] = updated;
// };

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