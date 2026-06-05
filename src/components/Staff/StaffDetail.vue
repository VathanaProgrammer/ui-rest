<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="modelValue" class="modal-backdrop" @click.self="close">
        <Transition name="modal-slide">
          <div v-if="modelValue" class="modal-card" role="dialog" aria-modal="true" :aria-labelledby="`detail-title-${member?.id}`">

            <div class="modal-header">
              <div class="modal-header-inner">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                <h2 :id="`detail-title-${member?.id}`" class="modal-title">Staff Profile</h2>
              </div>
              <button class="modal-close" @click="close" aria-label="Close">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <div class="modal-body" v-if="member">

              <!-- ── Identity ───────────────────────────────────────────── -->
              <div class="identity-row">
                <div class="avatar-wrap">
                  <img
                    v-if="member.avatar"
                    :src="member.avatar"
                    :alt="member.name"
                    class="avatar-img"
                  />
                  <div v-else class="avatar-fallback">
                    {{ initials(member.name) }}
                  </div>
                </div>
                <div class="identity-info">
                  <div class="name-row">
                    <p class="member-name">{{ member.name }}</p>
                    <span class="role-badge">{{ member.role }}</span>
                  </div>
                  <!-- displayName if present -->
                  <p v-if="(member as any).displayName" class="member-display-name">
                    "{{ (member as any).displayName }}"
                  </p>
                  <p class="member-id">
                    <!-- employeeId preferred; fall back to internal id -->
                    {{ (member as any).employeeId || member.id }}
                  </p>
                </div>
              </div>

              <!-- ── Shift + Status cards ──────────────────────────────── -->
              <div class="info-grid">

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

              <!-- ── Contact information ────────────────────────────────── -->
              <p class="section-label">CONTACT INFORMATION</p>

              <div class="contact-list">

                <!-- Email -->
                <div class="contact-row">
                  <div class="contact-icon">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="2" y="4" width="20" height="16" rx="2"/>
                      <polyline points="2 6 12 13 22 6"/>
                    </svg>
                  </div>
                  <div>
                    <p class="contact-label">EMAIL ADDRESS</p>
                    <p class="contact-value">{{ member.email }}</p>
                  </div>
                </div>

                <!-- Phone — shown only if present -->
                <div v-if="(member as any).phoneNumber" class="contact-row">
                  <div class="contact-icon">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.8a16 16 0 0 0 6.29 6.29l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                    </svg>
                  </div>
                  <div>
                    <p class="contact-label">PHONE NUMBER</p>
                    <p class="contact-value">{{ (member as any).phoneNumber }}</p>
                  </div>
                </div>

              </div>

              <!-- ── Security ───────────────────────────────────────────── -->
              <p class="section-label">SECURITY</p>
              <div class="security-card">
                <div class="contact-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </div>
                <div>
                  <p class="contact-label">ACCESS PIN</p>
                  <p class="contact-value pin-masked">●●●●●●</p>
                </div>
                <span class="security-badge">BCRYPT</span>
              </div>

            </div><!-- /modal-body -->

            <div class="modal-footer">
              <button class="btn-cancel" @click="close">CANCEL</button>
              <button class="btn-edit" @click="onEdit">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
                EDIT PROFILE
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

// Derive two-letter initials from a full name
const initials = (name: string) =>
  name.trim().split(' ').filter(Boolean)
    .map(w => w[0].toUpperCase())
    .slice(0, 2).join('');

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
/* ── Backdrop ────────────────────────────────────────── */
.modal-backdrop {
  position: fixed; inset: 0; z-index: 9999;
  background: rgba(5, 10, 22, 0.78);
  backdrop-filter: blur(6px);
  display: flex; align-items: center; justify-content: center;
  padding: 20px;
}

/* ── Card ────────────────────────────────────────────── */
.modal-card {
  width: 100%; max-width: 480px;
  max-height: 92vh; overflow-y: auto;
  background: #111827;
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 18px;
  box-shadow: 0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(37,99,235,0.12) inset;
  font-family: 'Plus Jakarta Sans', sans-serif;
}

/* ── Header ──────────────────────────────────────────── */
.modal-header {
  display: flex; align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  position: sticky; top: 0; background: #111827; z-index: 1;
  border-bottom: 1px solid rgba(255,255,255,0.05);
}
.modal-header-inner {
  display: flex; align-items: center; gap: 8px;
  color: #94a3b8;
}
.modal-title {
  font-size: 14px; font-weight: 700;
  color: #e2e8f0; margin: 0; letter-spacing: 0.2px;
}
.modal-close {
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 8px; color: #94a3b8; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  width: 34px; height: 34px; flex-shrink: 0;
  transition: background 0.15s, color 0.15s;
}
.modal-close:hover { background: rgba(255,255,255,0.1); color: #f1f5f9; }

/* ── Body ────────────────────────────────────────────── */
.modal-body { padding: 22px 24px; display: flex; flex-direction: column; gap: 20px; }

/* ── Identity ────────────────────────────────────────── */
.identity-row { display: flex; align-items: center; gap: 16px; }

.avatar-wrap { flex-shrink: 0; }
.avatar-img {
  width: 72px; height: 72px; border-radius: 12px;
  object-fit: cover; border: 1px solid rgba(255,255,255,0.08);
  display: block;
}
.avatar-fallback {
  width: 72px; height: 72px; border-radius: 12px;
  background: #1e3a5f; border: 1px solid #2563eb33;
  display: flex; align-items: center; justify-content: center;
  font-size: 22px; font-weight: 700; color: #60a5fa; letter-spacing: -1px;
}

.identity-info { display: flex; flex-direction: column; gap: 4px; }
.name-row { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.member-name { font-size: 20px; font-weight: 700; color: #f1f5f9; margin: 0; line-height: 1.2; letter-spacing: -0.3px; }
.role-badge {
  background: #2563eb; color: #fff;
  font-size: 11px; font-weight: 700;
  padding: 4px 10px; border-radius: 6px; letter-spacing: 0.4px;
  white-space: nowrap;
}
.member-display-name { font-size: 13px; color: #475569; margin: 0; font-style: italic; }
.member-id { font-size: 12px; color: #334155; margin: 0; font-family: 'JetBrains Mono', monospace; }

/* ── Info grid ───────────────────────────────────────── */
.info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }

.info-card {
  background: #0f1929;
  border: 1px solid #1e2d45;
  border-radius: 10px; padding: 14px 16px;
  display: flex; flex-direction: column; gap: 6px;
}
.card-label {
  display: flex; align-items: center; gap: 6px;
  font-size: 10px; font-weight: 700;
  color: #475569; letter-spacing: 1px;
}
.card-value {
  font-size: 15px; font-weight: 700; color: #e2e8f0;
  display: flex; align-items: center; gap: 7px;
}
.card-sub {
  display: flex; align-items: center; gap: 5px;
  font-size: 12px; color: #475569;
  font-family: 'JetBrains Mono', monospace;
}

/* Status colors */
.status-value.active   { color: #4ade80; }
.status-value.on-break { color: #fbbf24; }
.status-value.off-duty { color: #f87171; }

.status-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
.status-dot.active   { background: #4ade80; box-shadow: 0 0 6px #4ade80aa; }
.status-dot.on-break { background: #fbbf24; }
.status-dot.off-duty { background: #f87171; }

/* ── Section label ───────────────────────────────────── */
.section-label {
  font-size: 10px; font-weight: 700; color: #475569;
  letter-spacing: 1px; margin: 0;
}

/* ── Contact list ────────────────────────────────────── */
.contact-list { display: flex; flex-direction: column; gap: 8px; margin-top: -10px; }

.contact-row, .security-card {
  background: #0f1929;
  border: 1px solid #1e2d45;
  border-radius: 10px; padding: 14px 16px;
  display: flex; align-items: center; gap: 12px;
}
.security-card { justify-content: space-between; }

.contact-icon {
  color: #475569; flex-shrink: 0;
  display: flex; align-items: center;
}
.contact-label {
  font-size: 10px; font-weight: 700;
  color: #475569; letter-spacing: 0.8px;
  margin: 0 0 4px;
}
.contact-value {
  font-size: 13px; color: #94a3b8; margin: 0;
  font-family: 'JetBrains Mono', monospace;
}
.pin-masked { letter-spacing: 3px; color: #334155; }

.security-badge {
  background: #1e2d45; color: #475569;
  font-size: 10px; font-weight: 700; letter-spacing: 1px;
  padding: 3px 8px; border-radius: 5px;
  margin-left: auto; flex-shrink: 0;
}

/* ── Footer ──────────────────────────────────────────── */
.modal-footer {
  display: flex; align-items: center;
  justify-content: flex-end; gap: 12px;
  padding: 16px 24px 24px;
  position: sticky; bottom: 0; background: #111827;
  border-top: 1px solid rgba(255,255,255,0.05);
}
.btn-cancel {
  background: transparent; border: none; color: #64748b;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 13px; font-weight: 700; letter-spacing: 0.5px;
  cursor: pointer; padding: 11px 18px; border-radius: 10px;
  transition: color 0.15s, background 0.15s;
}
.btn-cancel:hover { background: rgba(255,255,255,0.05); color: #94a3b8; }
.btn-edit {
  display: flex; align-items: center; gap: 8px;
  background: #2563eb; color: #fff;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 13px; font-weight: 700; letter-spacing: 0.5px;
  padding: 11px 22px; border-radius: 10px; border: none;
  cursor: pointer; transition: background 0.15s;
}
.btn-edit:hover { background: #1d4ed8; }

/* ── Transitions ─────────────────────────────────────── */
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.22s ease; }
.modal-fade-enter-from,   .modal-fade-leave-to     { opacity: 0; }
.modal-slide-enter-active { transition: opacity 0.22s ease, transform 0.22s cubic-bezier(0.34,1.56,0.64,1); }
.modal-slide-leave-active { transition: opacity 0.18s ease, transform 0.18s ease; }
.modal-slide-enter-from   { opacity: 0; transform: scale(0.94) translateY(10px); }
.modal-slide-leave-to     { opacity: 0; transform: scale(0.97) translateY(6px); }
</style>