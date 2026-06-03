<template>
  <Teleport to="body">
    <Transition name="overlay">
      <div v-if="modelValue" class="overlay" @click.self="close">
        <Transition name="modal">
          <div v-if="modelValue" class="modal" role="dialog" aria-modal="true" :aria-label="`Staff Profile – ${member?.name}`">

            <!-- Header -->
            <div class="modal-header">
              <span class="modal-title">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                Staff Profile
              </span>
              <button class="btn-close" @click="close" aria-label="Close">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <div class="modal-body" v-if="member">

              <!-- Identity -->
              <div class="identity">
                <img :src="member.avatar" :alt="member.name" class="avatar" />
                <div class="identity-info">
                  <div class="name-row">
                    <h2 class="member-name">{{ member.name }}</h2>
                    <span class="role-badge">{{ member.role }}</span>
                  </div>
                  <span class="member-id">ID: {{ member.id }}</span>
                </div>
              </div>

              <!-- Info Grid -->
              <div class="info-grid">
                <!-- Shift card -->
                <div class="info-card">
                  <div class="card-label">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                    </svg>
                    CURRENT SHIFT
                  </div>
                  <div class="card-value">{{ member.shift }} Shift</div>
                  <div class="card-sub">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                    </svg>
                    {{ member.shiftHours }}
                  </div>
                </div>

                <!-- Status card -->
                <div class="info-card">
                  <div class="card-label">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                      <circle cx="12" cy="12" r="3"/>
                      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>
                    </svg>
                    STATUS
                  </div>
                  <div class="card-value status-value" :class="member.status">
                    <span class="status-dot" :class="member.status"></span>
                    {{ statusLabel(member.status) }}
                  </div>
                  <div class="card-sub">{{ statusDescription(member.status) }}</div>
                </div>
              </div>

              <!-- Contact -->
              <div class="section-label">CONTACT INFORMATION</div>
              <div class="contact-card">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="2" y="4" width="20" height="16" rx="2"/>
                  <polyline points="22,4 12,13 2,4"/>
                </svg>
                <div>
                  <div class="contact-label">EMAIL ADDRESS</div>
                  <div class="contact-value">{{ member.email }}</div>
                </div>
              </div>

            </div>

            <!-- Footer -->
            <div class="modal-footer">
              <button class="btn-cancel" @click="close">Cancel</button>
              <button class="btn-edit" @click="onEdit">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
                Edit Profile
              </button>
            </div>

          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import type { StaffMember, StaffStatus } from './types';

const props = defineProps<{
  modelValue: boolean;
  member: StaffMember | null;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  edit: [id: string];
}>();

const close = () => emit('update:modelValue', false);

const onEdit = () => {
  if (props.member) {
    emit('edit', props.member.id);
    close();
  }
};

const statusLabel = (s: StaffStatus) => {
  if (s === 'active')   return 'Active';
  if (s === 'on-break') return 'On Break';
  return 'Off Duty';
};

const statusDescription = (s: StaffStatus) => {
  if (s === 'active')   return 'Currently clocked in';
  if (s === 'on-break') return 'On a scheduled break';
  return 'Currently off duty';
};
</script>

<style scoped>
/* ── Overlay ─────────────────────────────────────────── */
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(5, 10, 20, 0.75);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
}

/* ── Modal ───────────────────────────────────────────── */
.modal {
  background: #111827;
  border: 1px solid #1e2d45;
  border-radius: 16px;
  width: 100%;
  max-width: 480px;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.6);
  overflow: hidden;
  font-family: 'Plus Jakarta Sans', sans-serif;
}

/* ── Header ──────────────────────────────────────────── */
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 22px;
  border-bottom: 1px solid #1e2d45;
}

.modal-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 700;
  color: #e2e8f0;
}

.btn-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 8px;
  border: 1px solid #1e2d45;
  background: transparent;
  color: #64748b;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}
.btn-close:hover { background: #1e2d45; color: #e2e8f0; }

/* ── Body ────────────────────────────────────────────── */
.modal-body { padding: 22px; display: flex; flex-direction: column; gap: 20px; }

/* ── Identity ────────────────────────────────────────── */
.identity { display: flex; align-items: center; gap: 16px; }

.avatar {
  width: 72px;
  height: 72px;
  border-radius: 12px;
  object-fit: cover;
  border: 1px solid #1e2d45;
  flex-shrink: 0;
}

.identity-info { display: flex; flex-direction: column; gap: 6px; }

.name-row { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }

.member-name {
  font-size: 20px;
  font-weight: 700;
  color: #f1f5f9;
  margin: 0;
  line-height: 1.2;
}

.role-badge {
  background: #2563eb;
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 6px;
  letter-spacing: 0.4px;
  white-space: nowrap;
}

.member-id { font-size: 13px; color: #475569; }

/* ── Info grid ───────────────────────────────────────── */
.info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }

.info-card {
  background: #0f1929;
  border: 1px solid #1e2d45;
  border-radius: 10px;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.card-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 10px;
  font-weight: 700;
  color: #475569;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.card-value {
  font-size: 15px;
  font-weight: 700;
  color: #e2e8f0;
  display: flex;
  align-items: center;
  gap: 7px;
}

.card-sub {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  color: #475569;
  font-family: 'JetBrains Mono', monospace;
}

/* Status colors */
.status-value.active   { color: #4ade80; }
.status-value.on-break { color: #fbbf24; }
.status-value.off-duty { color: #f87171; }

.status-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
.status-dot.active    { background: #4ade80; box-shadow: 0 0 6px #4ade80aa; }
.status-dot.on-break  { background: #fbbf24; }
.status-dot.off-duty  { background: #f87171; }

/* ── Contact ─────────────────────────────────────────── */
.section-label {
  font-size: 10px;
  font-weight: 700;
  color: #475569;
  letter-spacing: 1px;
  text-transform: uppercase;
  margin-bottom: -10px;
}

.contact-card {
  background: #0f1929;
  border: 1px solid #1e2d45;
  border-radius: 10px;
  padding: 14px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  color: #475569;
}

.contact-label {
  font-size: 10px;
  font-weight: 700;
  color: #475569;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  margin-bottom: 4px;
}

.contact-value {
  font-size: 13px;
  color: #94a3b8;
  font-family: 'JetBrains Mono', monospace;
}

/* ── Footer ──────────────────────────────────────────── */
.modal-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  padding: 16px 22px;
  border-top: 1px solid #1e2d45;
}

.btn-cancel {
  padding: 9px 20px;
  border-radius: 9px;
  border: 1px solid #1e2d45;
  background: transparent;
  color: #64748b;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}
.btn-cancel:hover { background: #1e2d45; color: #e2e8f0; }

.btn-edit {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 9px 20px;
  border-radius: 9px;
  border: none;
  background: #2563eb;
  color: #fff;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
}
.btn-edit:hover { background: #1d4ed8; }

/* ── Transitions ─────────────────────────────────────── */
.overlay-enter-active, .overlay-leave-active { transition: opacity 0.2s ease; }
.overlay-enter-from, .overlay-leave-to       { opacity: 0; }

.modal-enter-active  { transition: opacity 0.2s ease, transform 0.2s ease; }
.modal-leave-active  { transition: opacity 0.15s ease, transform 0.15s ease; }
.modal-enter-from    { opacity: 0; transform: translateY(12px) scale(0.98); }
.modal-leave-to      { opacity: 0; transform: translateY(8px) scale(0.99); }
</style>