<template>
  <div class="table-card">
    <table class="staff-table">
      <thead>
        <tr>
          <th>NAME / AVATAR</th>
          <th>ROLE</th>
          <th>STATUS</th>
          <th>CURRENT SHIFT</th>
          <th>CONTACT</th>
          <th>ACTIONS</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="member in staff" :key="member.id">
          <td>
            <div class="member-cell">
              <img :src="member.avatar" :alt="member.name" class="avatar" />
              <div>
                <div class="member-name">{{ member.name }}</div>
                <div class="member-id">ID: {{ member.id }}</div>
              </div>
            </div>
          </td>

          <td>
            <span class="role-badge">{{ member.role }}</span>
          </td>

          <td>
            <span class="status-pill" :class="member.status">
              <span class="status-dot" :class="member.status"></span>
              {{ statusLabel(member.status) }}
            </span>
          </td>

          <td>
            <div class="shift-name">{{ member.shift }}</div>
            <div class="shift-hours">{{ member.shiftHours }}</div>
          </td>

          <td class="contact-cell">{{ member.email }}</td>

          <!-- Actions -->
          <td>
            <div class="action-btns">
              <button class="btn-action btn-manage" @click="$emit('manage', member.id)">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>
                </svg>  
                View 
              </button>
              <button class="btn-action btn-edit" @click="$emit('edit', member.id)">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
               </svg>
                Edit
              </button>
              <button class="btn-action btn-delete" @click="$emit('delete', member.id)">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                  <path d="M10 11v6M14 11v6"/>
                  <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                </svg>
                Delete
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="table-footer">
      <span class="showing-text">Showing {{ staff.length }} of {{ totalStaff }} staff members</span>
      <div class="pagination">
        <button class="page-btn arrow" :disabled="currentPage === 1" @click="$emit('page', currentPage - 1)">‹</button>
        <button
          v-for="p in totalPages"
          :key="p"
          class="page-btn"
          :class="{ active: p === currentPage }"
          @click="$emit('page', p)"
        >{{ p }}</button>
        <button class="page-btn arrow" :disabled="currentPage === totalPages" @click="$emit('page', currentPage + 1)">›</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
//import { IconSettings, IconPencil, IconTrash } from '@tabler/icons-vue';
import type { StaffMember, StaffStatus } from './types';

defineProps<{
  staff: StaffMember[];
  totalStaff: number;
  currentPage: number;
  totalPages: number;
}>();

defineEmits<{
  manage: [id: string];
  edit:   [id: string];
  delete: [id: string];
  page:   [page: number];
}>();

const statusLabel = (s: StaffStatus) => {
  if (s === 'active')   return 'ACTIVE';
  if (s === 'on-break') return 'ON BREAK';
  return 'OFF DUTY';
};
</script>

<style scoped>
/* ── Layout ─────────────────────────────────────────── */
.table-card {
  background: #131c2e;
  border: 1px solid #1e2d45;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 24px;
}

.staff-table { width: 100%; border-collapse: collapse; }

thead tr    { border-bottom: 1px solid #1e2d45; }
thead th {
  padding: 14px 20px;
  text-align: left;
  font-size: 11px;
  font-weight: 700;
  color: #475569;
  letter-spacing: 1px;
  text-transform: uppercase;
  white-space: nowrap;
}

tbody tr          { border-bottom: 1px solid #1a2540; transition: background 0.15s; }
tbody tr:last-child { border-bottom: none; }
tbody tr:hover    { background: #162035; }
tbody td          { padding: 16px 20px; vertical-align: middle; }

/* ── Member cell ─────────────────────────────────────── */
.member-cell  { display: flex; align-items: center; gap: 12px; }
.avatar       { width: 42px; height: 42px; border-radius: 8px; object-fit: cover; border: 1px solid #1e2d45; flex-shrink: 0; }
.member-name  { font-size: 15px; font-weight: 600; color: #e2e8f0; line-height: 1.2; }
.member-id    { font-size: 12px; color: #475569; margin-top: 2px; }

/* ── Role badge ──────────────────────────────────────── */
.role-badge {
  background: #1e2d45;
  color: #94a3b8;
  font-size: 12px;
  font-weight: 600;
  padding: 5px 10px;
  border-radius: 6px;
  border: 1px solid #253554;
  white-space: nowrap;
}

/* ── Status pill ─────────────────────────────────────── */
.status-pill          { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 700; letter-spacing: 0.5px; }
.status-pill.active   { color: #4ade80; }
.status-pill.on-break { color: #fbbf24; }
.status-pill.off-duty { color: #ff2a00;; }

.status-dot           { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
.status-dot.active    { background: #4ade80; box-shadow: 0 0 6px #4ade80aa; }
.status-dot.on-break  { background: #fbbf24; }
.status-dot.off-duty  { background: #ff2a00; }

/* ── Shift ───────────────────────────────────────────── */
.shift-name  { font-size: 14px; font-weight: 600; color: #cbd5e1; }
.shift-hours { font-size: 12px; color: #475569; margin-top: 2px; font-family: 'JetBrains Mono', monospace; }

/* ── Contact ─────────────────────────────────────────── */
.contact-cell { font-size: 13px; color: #64748b; }

/* ── Action buttons ──────────────────────────────────── */
.action-btns { display: flex; align-items: center; gap: 6px; }

.btn-action {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 6px 11px;
  border-radius: 7px;
  border: 1px solid transparent;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.6px;
  text-transform: uppercase;
  cursor: pointer;
  transition: background 0.15s, color 0.15s, border-color 0.15s;
}

.btn-manage { background: transparent; border-color: #253554; color: #7090b0; }
.btn-manage:hover { background: #1e2d45; color: #e2e8f0; border-color: #3a5070; }

.btn-edit   { background: transparent; border-color: #1d3a5f; color: #3b82f6; }
.btn-edit:hover { background: #1d3a5f; color: #93c5fd; border-color: #2563eb; }

.btn-delete { background: transparent; border-color: #3b1f2a; color: #f87171; }
.btn-delete:hover { background: #3b1f2a; color: #fca5a5; border-color: #ef4444; }

/* ── Pagination footer ───────────────────────────────── */
.table-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  border-top: 1px solid #1e2d45;
}

.showing-text { font-size: 13px; color: #475569; }
.pagination   { display: flex; gap: 6px; }

.page-btn {
  width: 34px;
  height: 34px;
  border-radius: 8px;
  border: 1px solid #1e2d45;
  background: transparent;
  color: #64748b;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
}
.page-btn:hover:not(:disabled) { background: #1e2d45; color: #e2e8f0; }
.page-btn.active  { background: #2563eb; border-color: #2563eb; color: #fff; }
.page-btn:disabled { opacity: 0.3; cursor: not-allowed; }
.page-btn.arrow   { font-size: 18px; }
</style>