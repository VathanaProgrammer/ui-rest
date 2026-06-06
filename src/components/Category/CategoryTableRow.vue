<script setup lang="ts">
import { Pencil, Trash2, UtensilsCrossed } from 'lucide-vue-next';
import { ref } from 'vue';
import type { Category } from './types';

defineProps<{
  category: Category;
}>();

defineEmits<{
  (e: 'edit', id: number): void;
  (e: 'delete', id: number): void;
  (e: 'toggle-status', id: number): void;
}>();

const imgError = ref(false);

const onImgError = () => {
  imgError.value = true;
};
</script>

<template>
  <tr class="cat-row">
    <!-- Checkbox -->
    <td class="col-check">
      <span class="checkbox" />
    </td>

    <!-- Name + Image/Icon -->
    <td class="col-name">
      <div class="name-cell">
        <span class="cat-icon-wrap">
          <img
            v-if="category.imageUrl && !imgError"
            :src="category.imageUrl"
            :alt="category.name"
            class="cat-img"
            @error="onImgError"
          />
          <UtensilsCrossed
            v-else
            class="cat-icon"
            :style="{ color: category.iconColor || '#94a3b8' }"
          />
        </span>
        <span class="cat-name">{{ category.name }}</span>
      </div>
    </td>

    <!-- Item Count -->
    <td class="col-count">
      <span class="count-val">{{ category.itemCount ?? '—' }}</span>
    </td>

    <!-- Status -->
    <td class="col-status">
      <div class="status-cell">
        <button
          class="toggle-pill"
          :class="category.status === 'active' ? 'toggle-on' : 'toggle-off'"
          aria-label="Toggle status"
          @click="$emit('toggle-status', category.id)"
        >
          <span class="toggle-thumb" />
        </button>
        <span
          class="status-badge"
          :class="category.status === 'active' ? 'badge-active' : 'badge-inactive'"
        >
          {{ category.status === 'active' ? 'ACTIVE' : 'INACTIVE' }}
        </span>
      </div>
    </td>

    <!-- Display Order -->
    <td class="col-order">
      <span class="order-badge">{{ category.displayOrder }}</span>
    </td>

    <!-- Actions -->
    <td class="col-actions">
      <div class="action-btns">
        <button class="action-btn edit-btn" title="Edit" @click="$emit('edit', category.id)">
          <Pencil class="action-icon" />
        </button>
        <button class="action-btn delete-btn" title="Delete" @click="$emit('delete', category.id)">
          <Trash2 class="action-icon" />
        </button>
      </div>
    </td>
  </tr>
</template>

<style scoped>
.cat-row {
  border-bottom: 1px solid #1e293b;
  transition: background 0.12s;
}
.cat-row:last-child { border-bottom: none; }
.cat-row:hover { background: #131e30; }

td {
  padding: 1.1rem 1.25rem;
  vertical-align: middle;
}

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

/* Name cell */
.name-cell {
  display: flex;
  align-items: center;
  gap: 0.85rem;
}

.cat-icon-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.2rem;
  height: 2.2rem;
  border-radius: 0.45rem;
  flex-shrink: 0;
  background: #1e293b;
  overflow: hidden;   /* clips the image inside the rounded box */
}

/* Image from API */
.cat-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Fallback icon */
.cat-icon {
  width: 1rem;
  height: 1rem;
}

.cat-name {
  font-size: 0.95rem;
  font-weight: 500;
  color: #e2e8f0;
}

/* Count */
.count-val {
  font-size: 1rem;
  font-weight: 600;
  color: #cbd5e1;
}

/* Status toggle */
.status-cell {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}
.toggle-pill {
  position: relative;
  display: inline-flex;
  align-items: center;
  width: 2.25rem;
  height: 1.25rem;
  border-radius: 9999px;
  border: none;
  cursor: pointer;
  padding: 0 0.2rem;
  transition: background 0.2s;
  flex-shrink: 0;
}
.toggle-on  { background: #22c55e; }
.toggle-off { background: #334155; }
.toggle-thumb {
  display: block;
  width: 0.85rem;
  height: 0.85rem;
  border-radius: 50%;
  background: #fff;
  transition: transform 0.2s;
}
.toggle-on  .toggle-thumb { transform: translateX(1rem); }
.toggle-off .toggle-thumb { transform: translateX(0); }

.status-badge {
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.07em;
  padding: 0.2rem 0.65rem;
  border-radius: 9999px;
}
.badge-active {
  background: rgba(34, 197, 94, 0.15);
  color: #22c55e;
  border: 1px solid rgba(34, 197, 94, 0.3);
}
.badge-inactive {
  background: rgba(100, 116, 139, 0.15);
  color: #64748b;
  border: 1px solid rgba(100, 116, 139, 0.25);
}

/* Order */
.order-badge {
  display: inline-block;
  background: #1e293b;
  color: #94a3b8;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  padding: 0.25rem 0.65rem;
  border-radius: 0.35rem;
  min-width: 2.2rem;
  text-align: center;
}

/* Actions */
.action-btns {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.5rem;
}
.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 0.4rem;
  border: none;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}
.edit-btn   { background: #1e293b; color: #94a3b8; }
.edit-btn:hover   { background: #2563eb; color: #fff; }
.delete-btn { background: #1e293b; color: #94a3b8; }
.delete-btn:hover { background: rgba(239, 68, 68, 0.2); color: #ef4444; }
.action-icon { width: 0.9rem; height: 0.9rem; }
</style>