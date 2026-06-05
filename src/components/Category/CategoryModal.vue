<script setup lang="ts">
import { ref, watch } from 'vue';
import { X, UserPlus, Save, Image } from 'lucide-vue-next';
import type { Category } from './types';

const props = defineProps<{
  show: boolean;
  editCategory?: Category | null;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'submit', category: Omit<Category, 'id'>): void;
  (e: 'update', category: Category): void;
}>();

// ── Derived mode ──────────────────────────────────────────────────────
const isEditMode = () => !!props.editCategory;

// ── Form State ────────────────────────────────────────────────────────
const categoryName = ref('');
const displayOrder = ref('');
const status       = ref<'active' | 'inactive'>('active');
const iconColor    = ref('#3b82f6');
const iconBg       = ref('#1e3a5f');

const colorPresets = [
  { iconColor: '#3b82f6', iconBg: '#1e3a5f', label: 'Blue'   },
  { iconColor: '#10b981', iconBg: '#064e3b', label: 'Green'  },
  { iconColor: '#f97316', iconBg: '#431407', label: 'Orange' },
  { iconColor: '#06b6d4', iconBg: '#0c4a6e', label: 'Cyan'   },
  { iconColor: '#f59e0b', iconBg: '#451a03', label: 'Amber'  },
  { iconColor: '#a855f7', iconBg: '#3b0764', label: 'Purple' },
];

// ── Populate form when editCategory changes ───────────────────────────
watch(
  () => props.editCategory,
  (cat) => {
    if (cat) {
      categoryName.value = cat.name;
      displayOrder.value = cat.displayOrder;
      status.value       = cat.status;
      iconColor.value    = cat.iconColor;
      iconBg.value       = cat.iconBg;
    }
  },
  { immediate: true },
);

const selectPreset = (preset: typeof colorPresets[0]) => {
  iconColor.value = preset.iconColor;
  iconBg.value    = preset.iconBg;
};

const reset = () => {
  categoryName.value = '';
  displayOrder.value = '';
  status.value       = 'active';
  iconColor.value    = '#3b82f6';
  iconBg.value       = '#1e3a5f';
};

const handleClose = () => {
  reset();
  emit('close');
};

const handleSubmit = () => {
  if (!categoryName.value.trim()) return;

  if (isEditMode() && props.editCategory) {
    emit('update', {
      ...props.editCategory,
      name:         categoryName.value.trim(),
      displayOrder: displayOrder.value.trim() || props.editCategory.displayOrder,
      status:       status.value,
      iconColor:    iconColor.value,
      iconBg:       iconBg.value,
    });
  } else {
    emit('submit', {
      name:         categoryName.value.trim(),
      displayOrder: displayOrder.value.trim() || '—',
      status:       status.value,
      iconColor:    iconColor.value,
      iconBg:       iconBg.value,
      itemCount:    0,
    });
  }

  reset();
  emit('close');
};
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="backdrop" @click.self="handleClose">
        <div class="modal" role="dialog" aria-modal="true">

          <!-- Header -->
          <div class="modal-header">
            <div>
              <div class="title-row">
                <h2 class="modal-title">
                  {{ isEditMode() ? 'Edit Category' : 'Add New Category' }}
                </h2>
                <span v-if="isEditMode()" class="id-badge">#{{ editCategory?.id }}</span>
              </div>
              <p class="modal-sub">
                {{ isEditMode() ? 'Update the details for this category.' : 'Create a new category for your menu.' }}
              </p>
            </div>
            <button class="close-btn" @click="handleClose">
              <X class="close-icon" />
            </button>
          </div>

          <!-- Body -->
          <div class="modal-body">

            <!-- Icon color picker -->
            <div class="field">
              <label class="field-label">ICON COLOR</label>
              <div class="color-presets">
                <button
                  v-for="preset in colorPresets"
                  :key="preset.label"
                  class="color-dot"
                  :title="preset.label"
                  :style="{ background: preset.iconBg, outlineColor: preset.iconColor }"
                  :class="iconColor === preset.iconColor ? 'dot-active' : ''"
                  @click="selectPreset(preset)"
                >
                  <span class="dot-inner" :style="{ background: preset.iconColor }" />
                </button>
              </div>
              <div class="icon-preview" :style="{ background: iconBg }">
                <Image class="preview-icon" :style="{ color: iconColor }" />
              </div>
            </div>

            <!-- ID (read-only, edit mode only) -->
            <div v-if="isEditMode()" class="field">
              <label class="field-label">ID</label>
              <input
                class="field-input field-readonly"
                type="text"
                :value="`#${editCategory?.id}`"
                readonly
              />
            </div>

            <!-- Category Name -->
            <div class="field">
              <label class="field-label">CATEGORY NAME</label>
              <input
                v-model="categoryName"
                class="field-input"
                placeholder="e.g. Appetizers"
                type="text"
              />
            </div>

            <!-- Display Order + Status -->
            <div class="field-row">
              <div class="field">
                <label class="field-label">DISPLAY ORDER</label>
                <input
                  v-model="displayOrder"
                  class="field-input"
                  placeholder="e.g. 01"
                  type="text"
                  maxlength="3"
                />
                <span class="field-hint">Leave blank to auto-assign.</span>
              </div>

              <div class="field">
                <label class="field-label">STATUS</label>
                <select v-model="status" class="field-input field-select">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

          </div>

          <!-- Footer -->
          <div class="modal-footer">
            <button class="btn-cancel" @click="handleClose">CANCEL</button>
            <button
              class="btn-submit"
              :disabled="!categoryName.trim()"
              @click="handleSubmit"
            >
              <Save v-if="isEditMode()" class="submit-icon" />
              <UserPlus v-else class="submit-icon" />
              {{ isEditMode() ? 'SAVE CHANGES' : 'ADD CATEGORY' }}
            </button>
          </div>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1rem;
}

.modal {
  background: #0f172a;
  border: 1px solid #1e293b;
  border-radius: 0.75rem;
  width: 100%;
  max-width: 480px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Header */
.modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 1.5rem 1.5rem 1rem;
  border-bottom: 1px solid #1e293b;
}
.title-row {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}
.id-badge {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: #64748b;
  background: #1e293b;
  border: 1px solid #2d3f55;
  border-radius: 0.35rem;
  padding: 0.15rem 0.5rem;
}
.modal-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: #f1f5f9;
  letter-spacing: -0.01em;
}
.modal-sub {
  font-size: 0.8rem;
  color: #64748b;
  margin-top: 0.2rem;
}
.close-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  background: #1e293b;
  border: none;
  border-radius: 0.4rem;
  cursor: pointer;
  color: #94a3b8;
  transition: background 0.15s, color 0.15s;
  flex-shrink: 0;
}
.close-btn:hover { background: #334155; color: #f1f5f9; }
.close-icon { width: 1rem; height: 1rem; }

/* Body */
.modal-body {
  padding: 1.25rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
  overflow-y: auto;
  max-height: 60vh;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  flex: 1;
}
.field-row {
  display: flex;
  gap: 1rem;
}
.field-label {
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: #64748b;
}
.field-input {
  background: #1e293b;
  border: 1px solid #2d3f55;
  border-radius: 0.5rem;
  padding: 0.7rem 1rem;
  color: #e2e8f0;
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.15s;
  width: 100%;
  box-sizing: border-box;
}
.field-input::placeholder { color: #475569; }
.field-input:focus { border-color: #2563eb; }
.field-select { appearance: none; cursor: pointer; }
.field-hint { font-size: 0.72rem; color: #475569; }
.field-readonly {
  color: #475569;
  cursor: default;
  user-select: all;
}

/* Color presets */
.color-presets {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  flex-wrap: wrap;
}
.color-dot {
  width: 2rem;
  height: 2rem;
  border-radius: 0.4rem;
  border: 2px solid transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: outline 0.1s, transform 0.1s;
  outline: 2px solid transparent;
  outline-offset: 2px;
}
.color-dot:hover { transform: scale(1.1); }
.dot-active { outline-width: 2px; outline-style: solid; }
.dot-inner { width: 0.9rem; height: 0.9rem; border-radius: 50%; }

.icon-preview {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.5rem;
  margin-top: 0.25rem;
}
.preview-icon { width: 1.1rem; height: 1.1rem; }

/* Footer */
.modal-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid #1e293b;
}
.btn-cancel {
  background: transparent;
  border: none;
  color: #64748b;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  cursor: pointer;
  padding: 0.6rem 1rem;
  border-radius: 0.4rem;
  transition: color 0.15s;
}
.btn-cancel:hover { color: #94a3b8; }
.btn-submit {
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
  transition: background 0.15s, opacity 0.15s;
}
.btn-submit:hover:not(:disabled) { background: #1d4ed8; }
.btn-submit:disabled { opacity: 0.45; cursor: not-allowed; }
.submit-icon { width: 1rem; height: 1rem; }

/* Transition */
.modal-enter-active,
.modal-leave-active { transition: opacity 0.2s ease; }
.modal-enter-active .modal,
.modal-leave-active .modal { transition: transform 0.2s ease, opacity 0.2s ease; }
.modal-enter-from,
.modal-leave-to { opacity: 0; }
.modal-enter-from .modal,
.modal-leave-to .modal { transform: translateY(-12px); opacity: 0; }
</style>