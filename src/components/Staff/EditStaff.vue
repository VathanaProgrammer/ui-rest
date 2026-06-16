<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="modelValue" class="modal-backdrop" @click.self="$emit('update:modelValue', false)">
        <Transition name="modal-slide">
          <div v-if="modelValue" class="modal-card" role="dialog" aria-modal="true" aria-labelledby="modal-title">

            <div class="modal-header">
              <div>
                <h2 id="modal-title" class="modal-title">Edit Staff Member</h2>
                <p class="modal-subtitle">Update the details for this staff member.</p>
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

              <!-- ─────────────────────────────────────────────────────────
                   SECTION: Identity
                   Fields: fullName, displayName
                   API shape: { fullName: string, displayName: string }
              ──────────────────────────────────────────────────────────── -->

              <!-- Full Name -->
              <div class="field-group full">
                <label class="field-label">FULL NAME</label>
                <div class="input-wrap">
                  <input v-model="form.name" class="field-input" type="text" placeholder="e.g. Marcus Chen" :class="{ error: errors.name }" />
                </div>
                <span v-if="errors.name" class="field-error">{{ errors.name }}</span>
              </div>

              <!-- Display Name -->
              <div class="field-group full">
                <label class="field-label">DISPLAY NAME</label>
                <div class="input-wrap">
                  <input
                    v-model="form.displayName"
                    class="field-input"
                    type="text"
                    placeholder="e.g. Marcus C."
                    :class="{ error: errors.displayName }"
                  />
                </div>
                <span class="field-hint">Short name shown on station screens.</span>
                <span v-if="errors.displayName" class="field-error">{{ errors.displayName }}</span>
              </div>

              <!-- ─────────────────────────────────────────────────────────
                   SECTION: Work Assignment
                   Fields: role, shift, employeeId (read-only — set by API on creation)
                   API shape: { role: { id: number, roleName: string }, employeeId: string }
                   TODO: roles list → fetch from GET /api/roles
              ──────────────────────────────────────────────────────────── -->

              <!-- Role + Shift -->
              <div class="field-row">
                <div class="field-group">
                  <label class="field-label">ROLE</label>
                  <div class="input-wrap select-wrap">
                    <select v-model="form.role" class="field-input field-select" :class="{ error: errors.role }">
                      <option :value="0">Select role…</option>
                      <!--
                        TODO: replace `roles` with API data:
                        const roles = await fetch('/api/roles').then(r => r.json())
                        map to: { id: r.id, label: r.roleName }
                      -->
                      <option v-for="r in roles" :key="r.id" :value="r.id">{{ r.label }}</option>
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

              <!-- Employee ID — read-only; was auto-assigned by API on creation -->
              <div class="field-group full">
                <label class="field-label">EMPLOYEE ID</label>
                <div class="input-wrap icon-input">
                  <svg class="input-prefix-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="2" y="7" width="20" height="14" rx="2"/>
                    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
                    <line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/>
                  </svg>
                  <!--
                    TODO: API returns employeeId on the member object (e.g. "EMP-2026-089").
                    Display as read-only; it cannot be changed after creation.
                  -->
                  <input
                    :value="form.employeeId"
                    class="field-input has-prefix readonly-input"
                    type="text"
                    readonly
                    tabindex="-1"
                  />
                </div>
                <span class="field-hint">Assigned by the system — cannot be changed.</span>
              </div>

              <!-- ─────────────────────────────────────────────────────────
                   SECTION: Status
                   API shape: { currentStatus: 'ACTIVE' | 'ON_BREAK' | 'OFF_DUTY' }
                   Note: API uses UPPER_SNAKE_CASE; mapped to StaffStatus (lowercase-kebab)
              ──────────────────────────────────────────────────────────── -->

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

              <!-- ─────────────────────────────────────────────────────────
                   SECTION: Contact
                   Fields: emailAddress, phoneNumber
                   API shape: { emailAddress: string, phoneNumber: string }
              ──────────────────────────────────────────────────────────── -->

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

              <!-- Phone Number -->
              <div class="field-group full">
                <label class="field-label">PHONE NUMBER</label>
                <div class="input-wrap icon-input">
                  <svg class="input-prefix-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.8a16 16 0 0 0 6.29 6.29l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                  <input
                    v-model="form.phoneNumber"
                    class="field-input has-prefix"
                    type="tel"
                    placeholder="+1-555-0199"
                    :class="{ error: errors.phoneNumber }"
                  />
                </div>
                <span v-if="errors.phoneNumber" class="field-error">{{ errors.phoneNumber }}</span>
              </div>

              <!-- ─────────────────────────────────────────────────────────
                   SECTION: Security — PIN reset (optional on edit)
                   Leave both fields blank to keep the existing PIN unchanged.
                   API shape: { accessPin: string } — only sent if user fills it in.
              ──────────────────────────────────────────────────────────── -->

              <div class="field-row">
                <div class="field-group">
                  <label class="field-label">NEW PIN <span class="field-label-optional">(OPTIONAL)</span></label>
                  <div class="input-wrap icon-input">
                    <svg class="input-prefix-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                    <input
                      v-model="form.accessPin"
                      class="field-input has-prefix"
                      :type="showPin ? 'text' : 'password'"
                      placeholder="Leave blank to keep"
                      maxlength="6"
                      inputmode="numeric"
                      :class="{ error: errors.accessPin }"
                    />
                    <button type="button" class="pin-toggle" @click="showPin = !showPin" :aria-label="showPin ? 'Hide PIN' : 'Show PIN'">
                      <svg v-if="!showPin" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                      </svg>
                      <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    </button>
                  </div>
                  <span class="field-hint">4–6 digits. Stored securely via bcrypt.</span>
                  <span v-if="errors.accessPin" class="field-error">{{ errors.accessPin }}</span>
                </div>

                <div class="field-group">
                  <label class="field-label">CONFIRM NEW PIN</label>
                  <div class="input-wrap icon-input">
                    <svg class="input-prefix-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                    <input
                      v-model="form.accessPinConfirm"
                      class="field-input has-prefix"
                      :type="showPin ? 'text' : 'password'"
                      placeholder="Re-enter new PIN"
                      maxlength="6"
                      inputmode="numeric"
                      :class="{ error: errors.accessPinConfirm }"
                    />
                  </div>
                  <span v-if="errors.accessPinConfirm" class="field-error">{{ errors.accessPinConfirm }}</span>
                </div>
              </div>

            </div><!-- /form-body -->

            <div class="modal-footer">
              <button class="btn-cancel" @click="$emit('update:modelValue', false)">CANCEL</button>
              <button class="btn-submit" :disabled="submitting" @click="handleSubmit">
                <svg v-if="!submitting" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v14a2 2 0 0 1-2 2z"/>
                  <polyline points="17 21 17 13 7 13 7 21"/>
                  <polyline points="7 3 7 8 15 8"/>
                </svg>
                <svg v-else class="spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="M21 12a9 9 0 1 1-6.22-8.56"/>
                </svg>
                {{ submitting ? 'SAVING…' : 'SAVE CHANGES' }}
              </button>
            </div>

          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import type { StaffMember, StaffStatus } from './types';

const props = defineProps<{
  modelValue: boolean;
  member: StaffMember | null;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void;
  (e: 'staff-updated', payload: StaffMember & {
    displayName: string;
    phoneNumber: string;
    employeeId: string;
    accessPin?: string;   // only present if user chose to reset it
  }): void;
}>();

const roles = ref<{ id: number; label: string }[]>([]);

import { onMounted } from 'vue';
import { api } from '../../utils/api';

onMounted(async () => {
  try {
    const res = await api.get('/roles');
    if (res.status === 1) {
      roles.value = res.data.map((r: any) => ({
        id: r.id,
        label: r.roleName
      }));
    }
  } catch (e) {
    console.error('Failed to fetch roles:', e);
  }
});

const shifts = [
  { label: 'Morning',   display: 'Morning   (06:00 – 14:00)' },
  { label: 'Afternoon', display: 'Afternoon (10:00 – 18:00)' },
  { label: 'Evening',   display: 'Evening   (14:00 – 22:00)' },
  { label: 'Night',     display: 'Night     (22:00 – 06:00)' },
];

// API shape: currentStatus is UPPER_SNAKE_CASE; mapped to StaffStatus (lowercase-kebab)
const statuses: { value: StaffStatus; label: string }[] = [
  { value: 'active',   label: 'Active'   },
  { value: 'on-break', label: 'On Break' },
  { value: 'off-duty', label: 'Off Duty' },
];

// ── State ────────────────────────────────────────────────────────────────────
const previewUrl = ref('');
const submitting = ref(false);
const showPin    = ref(false);

const form = reactive({
  name:             '',
  displayName:      '',    // API: displayName
  role:             0,     // API: role.id (number)
  shift:            '',
  email:            '',    // API: emailAddress
  phoneNumber:      '',    // API: phoneNumber
  employeeId:       '',    // API: employeeId — read-only after creation
  accessPin:        '',    // API: accessPin — only sent if filled
  accessPinConfirm: '',    // client-only; NOT sent to API
  status:           'off-duty' as StaffStatus,
});

const errors = reactive({
  name:             '',
  displayName:      '',
  role:             '',
  shift:            '',
  email:            '',
  phoneNumber:      '',
  accessPin:        '',
  accessPinConfirm: '',
});

// Populate form when the member prop changes
watch(
  () => props.member,
  (m) => {
    if (!m) return;
    form.name        = m.name;
    form.displayName = (m as any).displayName ?? '';
    // Wait for roles to load if needed
    setTimeout(() => {
      form.role = roles.value.find(r => r.label === m.role)?.id ?? 0;
    }, 100);
    form.shift       = m.shift;
    form.email       = m.email;
    form.phoneNumber = (m as any).phoneNumber ?? '';
    form.employeeId  = (m as any).employeeId  ?? m.id;
    form.status      = m.status;
    form.accessPin        = '';
    form.accessPinConfirm = '';
    previewUrl.value = m.avatar ?? '';
    // clear errors
    Object.keys(errors).forEach(k => ((errors as any)[k] = ''));
  },
  { immediate: true }
);

function onFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => { previewUrl.value = ev.target?.result as string; };
  reader.readAsDataURL(file);
}

function validate(): boolean {
  errors.name        = form.name.trim()        ? '' : 'Full name is required.';
  errors.displayName = form.displayName.trim() ? '' : 'Display name is required.';
  errors.role        = form.role               ? '' : 'Please select a role.';
  errors.shift       = form.shift              ? '' : 'Please select a shift.';
  errors.email       = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) ? '' : 'Enter a valid email.';
  errors.phoneNumber = form.phoneNumber.trim() ? '' : 'Phone number is required.';

  // PIN is optional on edit — only validate if the user has started typing
  if (form.accessPin) {
    errors.accessPin        = /^\d{4,6}$/.test(form.accessPin) ? '' : 'PIN must be 4–6 digits.';
    errors.accessPinConfirm = form.accessPin === form.accessPinConfirm ? '' : 'PINs do not match.';
  } else {
    errors.accessPin = errors.accessPinConfirm = '';
  }

  return !Object.values(errors).some(Boolean);
}

async function handleSubmit() {
  if (!validate() || !props.member) return;
  submitting.value = true;

  // TODO: replace the timeout below with a real API call:
  //
  // const payload: Record<string, unknown> = {
  //   fullName:      form.name,
  //   displayName:   form.displayName,
  //   role:          { id: form.role },
  //   shift:         form.shift,
  //   emailAddress:  form.email,
  //   phoneNumber:   form.phoneNumber,
  //   avatarUrl:     previewUrl.value || undefined,
  //   currentStatus: form.status.toUpperCase().replace('-', '_'),
  // };
  // if (form.accessPin) payload.accessPin = form.accessPin; // only send if changed
  //
  // await fetch(`/api/staff/${props.member.id}`, {
  //   method: 'PATCH',
  //   body: JSON.stringify(payload),
  //   headers: { 'Content-Type': 'application/json' },
  // });

  await new Promise(r => setTimeout(r, 700));

  const updatedRole = roles.value.find(r => r.id === form.role)?.label ?? props.member.role;

  emit('staff-updated', {
    ...props.member,
    name:        form.name,
    displayName: form.displayName,
    role:        updatedRole,
    roleId:      form.role,
    shift:       form.shift as StaffMember['shift'],
    email:       form.email,
    phoneNumber: form.phoneNumber,
    employeeId:  form.employeeId,
    status:      form.status,
    avatar:      previewUrl.value,
    ...(form.accessPin ? { accessPin: form.accessPin } : {}),
  } as any);

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
  width: 100%; max-width: 520px;
  max-height: 92vh; overflow-y: auto;
  background: #111827;
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 18px;
  box-shadow: 0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(37,99,235,0.12) inset;
  font-family: 'Plus Jakarta Sans', sans-serif;
}
.modal-header {
  display: flex; align-items: flex-start;
  justify-content: space-between; padding: 28px 28px 20px;
  position: sticky; top: 0; background: #111827; z-index: 1;
  border-bottom: 1px solid rgba(255,255,255,0.05);
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
.field-label-optional { font-weight: 400; color: #334155; letter-spacing: 0.5px; }
.field-hint  { font-size: 11.5px; color: #334155; margin-top: -2px; }
.input-wrap  { position: relative; }

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
.readonly-input { color: #475569; cursor: default; }
.readonly-input:focus { border-color: rgba(255,255,255,0.08); box-shadow: none; }

.field-select { -webkit-appearance: none; appearance: none; padding-right: 36px; cursor: pointer; }
.field-select option { background: #1e293b; }
.select-chevron {
  position: absolute; right: 12px; top: 50%;
  transform: translateY(-50%); color: #475569; pointer-events: none;
}

/* ── Status radio pills ─────────────────────────────── */
.status-options { display: flex; gap: 10px; flex-wrap: wrap; }
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

/* ── Icon prefix inputs ─────────────────────────────── */
.icon-input .input-prefix-icon {
  position: absolute; left: 13px; top: 50%;
  transform: translateY(-50%); color: #475569;
}
.icon-input .has-prefix { padding-left: 36px; padding-right: 36px; }

/* ── PIN toggle ──────────────────────────────────────── */
.pin-toggle {
  position: absolute; right: 12px; top: 50%;
  transform: translateY(-50%);
  background: none; border: none; padding: 0;
  color: #475569; cursor: pointer; display: flex;
  transition: color 0.15s;
}
.pin-toggle:hover { color: #94a3b8; }

.field-error { font-size: 11.5px; color: #f87171; margin-top: -2px; }

.modal-footer {
  display: flex; align-items: center;
  justify-content: flex-end; gap: 12px;
  padding: 24px 28px 28px;
  position: sticky; bottom: 0; background: #111827;
  border-top: 1px solid rgba(255,255,255,0.05);
  margin-top: 22px;
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