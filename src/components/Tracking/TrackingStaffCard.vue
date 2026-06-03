<script setup lang="ts">
// ─── TrackingStaffCard ────────────────────────────────────────────────────────
import type { StaffMember } from './types'

defineProps<{ member: StaffMember }>()

const ROLE_LABEL: Record<StaffMember['role'], string> = {
  server: 'Server',
  chef: 'Chef',
  runner: 'Runner',
}
</script>

<template>
  <div class="staff-card" :class="`staff-card--${member.status}`">
    <div class="staff-header">
      <div class="staff-avatar">{{ member.name.charAt(0) }}</div>
      <div class="staff-info">
        <span class="staff-name">{{ member.name }}</span>
        <span class="staff-role">{{ ROLE_LABEL[member.role] }}</span>
      </div>
      <span class="status-dot" :class="`status-dot--${member.status}`" />
    </div>
    <div class="staff-stats">
      <div class="stat">
        <span class="stat-value">{{ member.activeOrders }}</span>
        <span class="stat-label">Active</span>
      </div>
      <div class="stat">
        <span class="stat-value">{{ member.tablesServed }}</span>
        <span class="stat-label">Tables</span>
      </div>
      <div class="stat">
        <span class="stat-value">{{ member.avgServiceTime }}</span>
        <span class="stat-label">Avg Time</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.staff-card {
  background: #1a1a2e;
  border: 1px solid #2a2a3e;
  border-radius: 8px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.staff-card--on-break { opacity: 0.6; }

.staff-header {
  display: flex;
  align-items: center;
  gap: 10px;
}
.staff-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #2a2a3e;
  color: #1e88e5;
  font-weight: 700;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.staff-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.staff-name  { font-size: 0.88rem; font-weight: 600; color: #fff; }
.staff-role  { font-size: 0.72rem; color: #888; text-transform: uppercase; letter-spacing: 0.05em; }

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}
.status-dot--active   { background: #00d084; }
.status-dot--on-break { background: #ffd54f; }
.status-dot--offline  { background: #555; }

.staff-stats {
  display: flex;
  gap: 0;
  border-top: 1px solid #2a2a3e;
  padding-top: 10px;
}
.stat {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}
.stat + .stat { border-left: 1px solid #2a2a3e; }
.stat-value { font-size: 0.9rem; font-weight: 700; color: #fff; font-variant-numeric: tabular-nums; }
.stat-label { font-size: 0.65rem; color: #666; text-transform: uppercase; letter-spacing: 0.05em; }
</style>