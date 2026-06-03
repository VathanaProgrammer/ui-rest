<template>
  <div class="bottom-grid">
    <!-- Upcoming Shifts -->
    <div class="panel">
      <div class="panel-header">
        <span class="panel-icon green">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        </span>
        <span class="panel-title">Upcoming Shifts</span>
      </div>
      <div class="shifts-list">
        <div v-for="(shift, i) in upcomingShifts" :key="i" class="shift-row">
          <div>
            <div class="shift-staff-name">{{ shift.name }}</div>
            <div class="shift-detail">{{ shift.shift }}</div>
          </div>
          <span class="shift-starts-badge">STARTS IN {{ shift.startsIn }}</span>
        </div>
      </div>
    </div>

    <!-- Compliance Alerts -->
    <div class="panel">
      <div class="panel-header">
        <span class="panel-icon amber">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        </span>
        <span class="panel-title">Compliance Alerts</span>
      </div>
      <div class="alerts-list">
        <div
          v-for="alert in complianceAlerts"
          :key="alert.id"
          class="alert-row"
          :class="alert.level"
        >
          <span class="alert-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
          </span>
          <div>
            <div class="alert-title">{{ alert.title }}</div>
            <div class="alert-desc">{{ alert.description }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { UpcomingShift, ComplianceAlert } from './types';

defineProps<{
  upcomingShifts: UpcomingShift[];
  complianceAlerts: ComplianceAlert[];
}>();
</script>

<style scoped>
.bottom-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.panel {
  background: #131c2e;
  border: 1px solid #1e2d45;
  border-radius: 12px;
  padding: 20px;
}

.panel-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}

.panel-icon {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.panel-icon.green { background: rgba(34,197,94,0.12); color: #4ade80; }
.panel-icon.amber { background: rgba(245,158,11,0.12); color: #fbbf24; }

.panel-title {
  font-size: 15px;
  font-weight: 700;
  color: #e2e8f0;
}

/* Shifts */
.shifts-list { display: flex; flex-direction: column; gap: 10px; }

.shift-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #1a2540;
  border-left: 3px solid #2563eb;
  border-radius: 0 8px 8px 0;
  padding: 12px 14px;
}

.shift-staff-name { font-size: 14px; font-weight: 600; color: #e2e8f0; }
.shift-detail     { font-size: 12px; color: #475569; margin-top: 2px; }

.shift-starts-badge {
  font-size: 11px;
  font-weight: 700;
  color: #60a5fa;
  letter-spacing: 0.5px;
  white-space: nowrap;
}

/* Alerts */
.alerts-list { display: flex; flex-direction: column; gap: 10px; }

.alert-row {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px;
  border-radius: 8px;
}
.alert-row.error   { background: rgba(239,68,68,0.1);  border: 1px solid rgba(239,68,68,0.2); }
.alert-row.warning { background: rgba(245,158,11,0.1); border: 1px solid rgba(245,158,11,0.2); }
.alert-row.info    { background: rgba(59,130,246,0.1);  border: 1px solid rgba(59,130,246,0.2); }

.alert-icon { flex-shrink: 0; margin-top: 1px; }
.alert-row.error   .alert-icon { color: #f87171; }
.alert-row.warning .alert-icon { color: #fbbf24; }
.alert-row.info    .alert-icon { color: #60a5fa; }

.alert-title { font-size: 14px; font-weight: 700; color: #f1f5f9; }
.alert-desc  { font-size: 13px; color: #94a3b8; margin-top: 3px; line-height: 1.4; }

@media (max-width: 768px) {
  .bottom-grid { grid-template-columns: 1fr; }
}
</style>