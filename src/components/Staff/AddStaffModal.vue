<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="modelValue" class="modal-backdrop" @click.self="$emit('update:modelValue', false)">
        <Transition name="modal-slide">
          <div v-if="modelValue" class="modal-card" role="dialog" aria-modal="true" aria-labelledby="modal-title">

            <div class="modal-header">
              <div>
                <h2 id="modal-title" class="modal-title">Add New Staff</h2>
                <p class="modal-subtitle">Onboard a new member to the HEKS ecosystem.</p>
              </div>
              <button class="modal-close" @click="$emit('update:modelValue', false)" aria-label="Close">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <div class="avatar-row">
              <label class="avatar-upload" :class="{ 'has-preview': previewUrl }" :style="previewUrl ? `background-image: url(${previewUrl})` : ''">
                <input type="file" accept="image/jpeg,image/png" @change="onFileChange" hidden />
                <template v-if="!previewUrl">
                  <svg class="upload-icon" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                    <rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                  <span class="upload-label">UPLOAD</span>
                </template>
              </label>
              <div class="avatar-meta">
                <p class="avatar-meta-title">PROFILE PICTURE</p>
                <p class="avatar-meta-hint">JPG or PNG, max 2MB. A square ratio works best for station avatars.</p>
              </div>
            </div>

            <div class="form-body">

              <!-- Full Name -->
              <div class="field-group full">
                <label class="field-label">FULL NAME</label>
                <div class="input-wrap">
                  <input v-model="form.name" class="field-input" type="text" placeholder="e.g. Marcus Chen" :class="{ error: errors.name }" />
                </div>
                <span v-if="errors.name" class="field-error">{{ errors.name }}</span>
              </div>

              <!-- Role + Shift -->
              <div class="field-row">
                <div class="field-group">
                  <label class="field-label">ROLE</label>
                  <div class="input-wrap select-wrap">
                    <select v-model="form.role" class="field-input field-select" :class="{ error: errors.role }">
                      <option value="">Select role…</option>
                      <option v-for="r in roles" :key="r" :value="r">{{ r }}</option>
                    </select>
                    <svg class="select-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
                  </div>
                  <span v-if="errors.role" class="field-error">{{ errors.role }}</span>
                </div>

                <div class="field-group">
                  <label class="field-label">SHIFT</label>
                  <div class="input-wrap select-wrap">
                    <select v-model="form.shift" class="field-input field-select" :class="{ error: errors.shift }">
                      <option value="">Select shift…</option>
                      <option v-for="s in shifts" :key="s.label" :value="s.label">{{ s.display }}</option>
                    </select>
                    <svg class="select-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
                  </div>
                  <span v-if="errors.shift" class="field-error">{{ errors.shift }}</span>
                </div>
              </div>

              <!-- Status -->
              <div class="field-group full">
                <label class="field-label">STATUS</label>
                <div class="status-options">
                  <label
                    v-for="s in statuses"
                    :key="s.value"
                    class="status-option"
                    :class="[s.value, { selected: form.status === s.value }]"
                  >
                    <input type="radio" v-model="form.status" :value="s.value" hidden />
                    <span class="status-dot-sm" :class="s.value"></span>
                    {{ s.label }}
                  </label>
                </div>
              </div>

              <!-- Contact Email -->
              <div class="field-group full">
                <label class="field-label">CONTACT EMAIL</label>
                <div class="input-wrap icon-input">
                  <svg class="input-prefix-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="2 6 12 13 22 6"/>
                  </svg>
                  <input v-model="form.email" class="field-input has-prefix" type="email" placeholder="m.chen@heks-kitchen.com" :class="{ error: errors.email }" />
                </div>
                <span v-if="errors.email" class="field-error">{{ errors.email }}</span>
              </div>

            </div>

            <div class="modal-footer">
              <button class="btn-cancel" @click="$emit('update:modelValue', false)">CANCEL</button>
              <button class="btn-submit" :disabled="submitting" @click="handleSubmit">
                <svg v-if="!submitting" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/>
                  <line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/>
                </svg>
                <svg v-else class="spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="M21 12a9 9 0 1 1-6.22-8.56"/>
                </svg>
                {{ submitting ? 'ADDING…' : 'ADD STAFF' }}
              </button>
            </div>

          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import type { StaffStatus } from './types';

defineProps<{ modelValue: boolean }>();
const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void;
  (e: 'staff-added', payload: {
    name: string; role: string; shift: string; email: string; avatar: string; status: StaffStatus;
  }): void;
}>();

// ── Static data ──────────────────────────────────────────────────────────────
const roles = ['Head Chef', 'Sous Chef', 'Line Cook', 'Prep Cook', 'Server', 'Bartender', 'Host', 'Manager'];
const shifts = [
  { label: 'Morning',   display: 'Morning   (06:00 – 14:00)' },
  { label: 'Afternoon', display: 'Afternoon (10:00 – 18:00)' },
  { label: 'Evening',   display: 'Evening   (14:00 – 22:00)' },
  { label: 'Night',     display: 'Night     (22:00 – 06:00)' },
];
const statuses: { value: StaffStatus; label: string }[] = [
  { value: 'active',   label: 'Active'   },
  { value: 'on-break', label: 'On Break' },
  { value: 'off-duty', label: 'Off Duty' },
];

// ── State ────────────────────────────────────────────────────────────────────
const previewUrl = ref('');
const submitting = ref(false);
const form   = reactive({ name: '', role: '', shift: '', email: '', status: 'off-duty' as StaffStatus });
const errors = reactive({ name: '', role: '', shift: '', email: '' });

function onFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => { previewUrl.value = ev.target?.result as string; };
  reader.readAsDataURL(file);
}

function validate(): boolean {
  errors.name  = form.name.trim() ? '' : 'Full name is required.';
  errors.role  = form.role        ? '' : 'Please select a role.';
  errors.shift = form.shift       ? '' : 'Please select a shift.';
  errors.email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) ? '' : 'Enter a valid email.';
  return !errors.name && !errors.role && !errors.shift && !errors.email;
}

async function handleSubmit() {
  if (!validate()) return;
  submitting.value = true;
  await new Promise(r => setTimeout(r, 700));
  emit('staff-added', {
    name:   form.name,
    role:   form.role,
    shift:  form.shift,
    email:  form.email,
    avatar: previewUrl.value,
    status: form.status,
  });
  Object.assign(form, { name: '', role: '', shift: '', email: '', status: 'off-duty' });
  previewUrl.value = '';
  submitting.value = false;
  emit('update:modelValue', false);
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed; inset: 0; z-index: 9999;
  background: rgba(5, 10, 22, 0.78);
  backdrop-filter: blur(6px);
  display: flex; align-items: center; justify-content: center;
  padding: 20px;
}
.modal-card {
  width: 100%; max-width: 480px;
  background: #111827;
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 18px;
  box-shadow: 0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(37,99,235,0.12) inset;
  overflow: hidden;
  font-family: 'Plus Jakarta Sans', sans-serif;
}
.modal-header {
  display: flex; align-items: flex-start;
  justify-content: space-between; padding: 28px 28px 0;
}
.modal-title    { font-size: 20px; font-weight: 700; color: #f1f5f9; margin: 0 0 4px; letter-spacing: -0.3px; }
.modal-subtitle { font-size: 13px; color: #475569; margin: 0; }
.modal-close {
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 8px; color: #94a3b8; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  width: 34px; height: 34px; flex-shrink: 0;
  transition: background 0.15s, color 0.15s; margin-top: 2px;
}
.modal-close:hover { background: rgba(255,255,255,0.1); color: #f1f5f9; }

.avatar-row { display: flex; align-items: center; gap: 18px; padding: 22px 28px 0; }
.avatar-upload {
  width: 72px; height: 72px; min-width: 72px;
  border-radius: 12px; background: #1e293b;
  border: 1.5px dashed rgba(255,255,255,0.12);
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  cursor: pointer; gap: 4px;
  transition: border-color 0.15s, background 0.15s;
  background-size: cover; background-position: center;
}
.avatar-upload:hover       { border-color: #2563eb; background: #1a2540; }
.avatar-upload.has-preview { border-style: solid; border-color: #2563eb; }
.upload-icon  { color: #475569; }
.upload-label { font-size: 9px; font-weight: 700; color: #475569; letter-spacing: 1px; }
.avatar-meta-title { font-size: 11px; font-weight: 700; color: #64748b; letter-spacing: 1px; margin: 0 0 5px; }
.avatar-meta-hint  { font-size: 12px; color: #475569; margin: 0; line-height: 1.5; }

.form-body { display: flex; flex-direction: column; gap: 18px; padding: 22px 28px 0; }
.field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.field-group { display: flex; flex-direction: column; gap: 6px; }
.field-group.full { grid-column: 1 / -1; }
.field-label { font-size: 11px; font-weight: 700; color: #64748b; letter-spacing: 1px; }
.input-wrap { position: relative; }

.field-input {
  width: 100%; background: #1e293b;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 10px; color: #f1f5f9;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 14px; padding: 11px 14px;
  box-sizing: border-box; outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.field-input::placeholder { color: #475569; }
.field-input:focus { border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37,99,235,0.18); }
.field-input.error { border-color: #ef4444; }

.field-select { -webkit-appearance: none; appearance: none; padding-right: 36px; cursor: pointer; }
.field-select option { background: #1e293b; }
.select-chevron {
  position: absolute; right: 12px; top: 50%;
  transform: translateY(-50%); color: #475569; pointer-events: none;
}

/* ── Status radio pills ─────────────────────────────── */
.status-options { display: flex; gap: 10px; }
.status-option {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 8px 14px; border-radius: 8px;
  border: 1px solid #1e2d45; background: #1a2540;
  font-size: 12px; font-weight: 700; letter-spacing: 0.4px;
  cursor: pointer; transition: all 0.15s;
  color: #64748b; user-select: none;
}
.status-option:hover { border-color: #2d3f5e; color: #94a3b8; }
.status-option.selected.active   { border-color: #166534; background: #052e16; color: #4ade80; }
.status-option.selected.on-break { border-color: #92400e; background: #1c1506; color: #fbbf24; }
.status-option.selected.off-duty { border-color: #ff0000; background: #1e293b; color: #94a3b8; }

.status-dot-sm { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
.status-dot-sm.active   { background: #4ade80; box-shadow: 0 0 5px #4ade80aa; }
.status-dot-sm.on-break { background: #fbbf24; }
.status-dot-sm.off-duty { background: #ff2a00; }

.icon-input .input-prefix-icon {
  position: absolute; left: 13px; top: 50%;
  transform: translateY(-50%); color: #475569;
}
.icon-input .has-prefix { padding-left: 36px; }
.field-error { font-size: 11.5px; color: #f87171; margin-top: -2px; }

.modal-footer {
  display: flex; align-items: center;
  justify-content: flex-end; gap: 12px;
  padding: 24px 28px 28px;
}
.btn-cancel {
  background: transparent; border: none; color: #64748b;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 13px; font-weight: 700; letter-spacing: 0.5px;
  cursor: pointer; padding: 11px 18px; border-radius: 10px;
  transition: color 0.15s, background 0.15s;
}
.btn-cancel:hover { background: rgba(255,255,255,0.05); color: #94a3b8; }
.btn-submit {
  display: flex; align-items: center; gap: 8px;
  background: #2563eb; color: #fff;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 13px; font-weight: 700; letter-spacing: 0.5px;
  padding: 11px 22px; border-radius: 10px; border: none;
  cursor: pointer; transition: background 0.15s, opacity 0.15s;
}
.btn-submit:hover:not(:disabled) { background: #1d4ed8; }
.btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }
.spin { animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.22s ease; }
.modal-fade-enter-from,   .modal-fade-leave-to     { opacity: 0; }
.modal-slide-enter-active { transition: opacity 0.22s ease, transform 0.22s cubic-bezier(0.34,1.56,0.64,1); }
.modal-slide-leave-active { transition: opacity 0.18s ease, transform 0.18s ease; }
.modal-slide-enter-from   { opacity: 0; transform: scale(0.94) translateY(10px); }
.modal-slide-leave-to     { opacity: 0; transform: scale(0.97) translateY(6px); }
</style>