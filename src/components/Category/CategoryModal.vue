<script setup lang="ts">
import { ref, watch } from 'vue';
import { X, UserPlus, Save, Image } from 'lucide-vue-next';
import type { Category } from './types';
import api from '../../utils/api.ts';

const props = defineProps<{
  show: boolean;
  editCategory?: Category | null;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'submit', category: Category): void;   // now returns full Category (with id from API)
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
const imageUrl     = ref('');        // For existing image URL or local preview
const selectedFile = ref<File | null>(null); // NEW: hold the selected file
const isLoading    = ref(false);     
const errorMsg     = ref('');        

const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    selectedFile.value = target.files[0];
    imageUrl.value = URL.createObjectURL(selectedFile.value);
  }
};



// ── Populate form when editCategory changes ───────────────────────────
watch(
  () => props.editCategory,
  (cat) => {
    if (cat) {
      categoryName.value = cat.name;
      // convert to string first, then check for '—'
      const order = cat.displayOrder != null ? String(cat.displayOrder) : '';
      status.value       = cat.status;
      iconColor.value    = cat.iconColor || '#3b82f6';
      imageUrl.value     = cat.imageUrl  || '';  // loads existing image into form
      selectedFile.value = null; // reset file
    }
  },
  { immediate: true },
);


const reset = () => {
  categoryName.value = '';
  displayOrder.value = '';
  status.value       = 'active';
  iconColor.value    = '#3b82f6';
  iconBg.value       = '#1e3a5f';
  imageUrl.value     = '';
  selectedFile.value = null;
  errorMsg.value     = '';
};

const handleClose = () => {
  reset();
  emit('close');
};

// ── API: Add new category ─────────────────────────────────────────────
const handleAdd = async () => {
  isLoading.value = true;
  errorMsg.value  = '';
  try {
    const formData = new FormData();
    formData.append('categoryName', categoryName.value.trim());
    if (displayOrder.value.trim()) {
      formData.append('displayOrder', displayOrder.value.trim());
    }
    formData.append('isActive', status.value === 'active' ? 'true' : 'false');
    if (iconColor.value) {
      formData.append('iconColor', iconColor.value);
    }
    if (selectedFile.value) {
      formData.append('image', selectedFile.value);
    }

    const response = await api.post('/categories', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    if (response.status === 1 && response.data) {
      // Map the API response back to your frontend Category shape
      const created: Category = {
        id:           response.data.id,
        name:         response.data.categoryName || response.data.name,
        displayOrder: response.data.displayOrder || '—',
        status:       response.data.isActive ? 'active' : 'inactive',
        iconColor:    response.data.iconColor || iconColor.value,
        imageUrl:     response.data.imageUrl  || '',
      };
      emit('submit', created);
      reset();
      emit('close');
    } else {
      errorMsg.value = response.message || 'Failed to add category.';
    }
  } catch (err) {
    console.error('Add category failed:', err);
    errorMsg.value = 'Something went wrong. Please try again.';
  } finally {
    isLoading.value = false;
  }
};

// ── API: Update existing category ─────────────────────────────────────
const handleUpdate = async () => {
  if (!props.editCategory) return;
  isLoading.value = true;
  errorMsg.value  = '';
  try {
    const rawOrder   = displayOrder.value != null ? String(displayOrder.value).trim() : '';
    const cleanOrder = rawOrder === '—' || rawOrder === '' 
                       ? '' 
                       : rawOrder;

    const formData = new FormData();
    formData.append('categoryName', categoryName.value.trim());
    if (cleanOrder) {
      formData.append('displayOrder', cleanOrder);
    }
    formData.append('isActive', status.value === 'active' ? 'true' : 'false');
    if (iconColor.value) {
      formData.append('iconColor', iconColor.value);
    }
    if (selectedFile.value) {
      formData.append('image', selectedFile.value);
    }

    console.log('PUT FormData ready');

    const response = await api.put(`/categories/${props.editCategory.id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    if (response.status === 1) {
      const updated: Category = {
        ...props.editCategory,
        name:         categoryName.value.trim(),
        displayOrder: cleanOrder != null ? String(cleanOrder) : String(props.editCategory.displayOrder),
        status:       status.value,
        iconColor:    iconColor.value || '#fff',
        imageUrl:     response.data?.imageUrl || imageUrl.value || '',
      };
      emit('update', updated);
      reset();
      emit('close');
    } else {
      errorMsg.value = response.message || 'Failed to update category.';
    }
  } catch (err: any) {
    console.error('Update failed:', err);
    errorMsg.value = err?.response?.data?.message
                     || err?.message
                     || 'Something went wrong. Please try again.';
  } finally {
    isLoading.value = false;
  }
};

const handleSubmit = () => {
  if (!categoryName.value.trim()) return;
  if (isEditMode()) {
    handleUpdate();
  } else {
    handleAdd();
  }
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

            <!-- Error message -->
            <div v-if="errorMsg" class="error-banner">
              {{ errorMsg }}
            </div>

           <!-- Image Upload / URL field -->
            <div class="field">
              <label class="field-label">IMAGE</label>
              <div class="image-field-row">
                <!-- Preview box -->
                <div class="image-preview-box" :style="{ background: iconBg }">
                  <img
                  v-if="imageUrl.trim()"
                  :src="imageUrl"
                  class="preview-img"
                  alt="Category image"
                  @error="imageUrl = ''"
                  />
                  <div v-else class="preview-placeholder">
                    <Image class="placeholder-icon" :style="{ color: iconColor }" />
                    <span class="placeholder-text">No image</span>
                  </div>
                </div>
               <!-- URL input stacked beside preview -->
                <div class="image-input-side">
                  <input
                        class="field-input"
                        type="file"
                        accept="image/*"
                        @change="handleFileChange"
                   />
                   <span class="field-hint">Select an image file from your computer.</span>
                </div>
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
            <button class="btn-cancel" :disabled="isLoading" @click="handleClose">CANCEL</button>
            <button
              class="btn-submit"
              :disabled="!categoryName.trim() || isLoading"
              @click="handleSubmit"
            >
              <!-- Spinner while loading -->
              <span v-if="isLoading" class="spinner" />
              <template v-else>
                <Save v-if="isEditMode()" class="submit-icon" />
                <UserPlus v-else class="submit-icon" />
              </template>
              {{ isLoading ? 'Saving...' : isEditMode() ? 'SAVE CHANGES' : 'ADD CATEGORY' }}
            </button>
          </div>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* all your existing styles unchanged, just adding these new ones below */

.error-banner {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #ef4444;
  font-size: 0.82rem;
  padding: 0.6rem 0.9rem;
  border-radius: 0.5rem;
}

.preview-img {
  width: 1.8rem;
  height: 1.8rem;
  object-fit: cover;
  border-radius: 0.3rem;
}

/* Spinner for loading state */
.spinner {
  display: inline-block;
  width: 0.9rem;
  height: 0.9rem;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* --- paste all your original styles below this line --- */
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
.modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 1.5rem 1.5rem 1rem;
  border-bottom: 1px solid #1e293b;
}
.title-row { display: flex; align-items: center; gap: 0.6rem; }
.id-badge {
  font-size: 0.7rem; font-weight: 700; letter-spacing: 0.05em;
  color: #64748b; background: #1e293b; border: 1px solid #2d3f55;
  border-radius: 0.35rem; padding: 0.15rem 0.5rem;
}
.modal-title { font-size: 1.2rem; font-weight: 700; color: #f1f5f9; letter-spacing: -0.01em; }
.modal-sub { font-size: 0.8rem; color: #64748b; margin-top: 0.2rem; }
.close-btn {
  display: flex; align-items: center; justify-content: center;
  width: 2rem; height: 2rem; background: #1e293b; border: none;
  border-radius: 0.4rem; cursor: pointer; color: #94a3b8;
  transition: background 0.15s, color 0.15s; flex-shrink: 0;
}
.close-btn:hover { background: #334155; color: #f1f5f9; }
.close-icon { width: 1rem; height: 1rem; }
.modal-body {
  padding: 1.25rem 1.5rem; display: flex; flex-direction: column;
  gap: 1.1rem; overflow-y: auto; max-height: 60vh;
}
.field { display: flex; flex-direction: column; gap: 0.4rem; flex: 1; }
.field-row { display: flex; gap: 1rem; }
.field-label { font-size: 0.68rem; font-weight: 700; letter-spacing: 0.1em; color: #64748b; }
.field-input {
  background: #1e293b; border: 1px solid #2d3f55; border-radius: 0.5rem;
  padding: 0.7rem 1rem; color: #e2e8f0; font-size: 0.9rem; outline: none;
  transition: border-color 0.15s; width: 100%; box-sizing: border-box;
}
.field-input::placeholder { color: #475569; }
.field-input:focus { border-color: #2563eb; }
.field-select { appearance: none; cursor: pointer; }
.field-hint { font-size: 0.72rem; color: #475569; }
.field-readonly { color: #475569; cursor: default; user-select: all; }
.color-presets { display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap; }
.color-dot {
  width: 2rem; height: 2rem; border-radius: 0.4rem; border: 2px solid transparent;
  cursor: pointer; display: flex; align-items: center; justify-content: center;
  transition: outline 0.1s, transform 0.1s; outline: 2px solid transparent; outline-offset: 2px;
}
.color-dot:hover { transform: scale(1.1); }
.dot-active { outline-width: 2px; outline-style: solid; }
.dot-inner { width: 0.9rem; height: 0.9rem; border-radius: 50%; }
/* ADD these instead: */
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

/* Image field layout */
.image-field-row {
  display: flex;
  gap: 0.85rem;
  align-items: flex-start;
}

.image-preview-box {
  width: 90px;
  height: 90px;
  flex-shrink: 0;
  border-radius: 0.6rem;
  overflow: hidden;
  border: 1px solid #2d3f55;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.preview-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
}
.placeholder-icon { width: 1.4rem; height: 1.4rem; }
.placeholder-text { font-size: 0.6rem; color: #475569; letter-spacing: 0.05em; }

.image-input-side {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}
.modal-footer {
  display: flex; align-items: center; justify-content: flex-end;
  gap: 0.75rem; padding: 1rem 1.5rem; border-top: 1px solid #1e293b;
}
.btn-cancel {
  background: transparent; border: none; color: #64748b; font-size: 0.8rem;
  font-weight: 700; letter-spacing: 0.06em; cursor: pointer; padding: 0.6rem 1rem;
  border-radius: 0.4rem; transition: color 0.15s;
}
.btn-cancel:hover { color: #94a3b8; }
.btn-submit {
  display: flex; align-items: center; gap: 0.5rem; background: #2563eb; color: #fff;
  border: none; border-radius: 0.5rem; padding: 0.65rem 1.25rem; font-size: 0.8rem;
  font-weight: 700; letter-spacing: 0.06em; cursor: pointer;
  transition: background 0.15s, opacity 0.15s;
}
.btn-submit:hover:not(:disabled) { background: #1d4ed8; }
.btn-submit:disabled { opacity: 0.45; cursor: not-allowed; }
.submit-icon { width: 1rem; height: 1rem; }
.modal-enter-active, .modal-leave-active { transition: opacity 0.2s ease; }
.modal-enter-active .modal, .modal-leave-active .modal { transition: transform 0.2s ease, opacity 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-from .modal, .modal-leave-to .modal { transform: translateY(-12px); opacity: 0; }
</style>