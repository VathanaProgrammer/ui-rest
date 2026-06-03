<template>
  <div class="stats-grid">
    <!-- Total Staff -->
    <div class="stat-card">
      <div class="stat-top">
        <div class="stat-icon blue">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        </div>
        <span class="stat-badge green">{{ stats.totalChange }}</span>
      </div>
      <div class="stat-label">TOTAL STAFF</div>
      <div class="stat-value">{{ String(stats.totalStaff).padStart(2, '0') }}</div>
    </div>

    <!-- Clocked In -->
    <div class="stat-card">
      <div class="stat-top">
        <div class="stat-icon teal">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        </div>
        <span class="stat-badge gray">{{ stats.capacity }}</span>
      </div>
      <div class="stat-label">CURRENTLY CLOCKED IN</div>
      <div class="stat-value">{{ String(stats.clockedIn).padStart(2, '0') }}</div>
    </div>

    <!-- On Break -->
    <div class="stat-card">
      <div class="stat-top">
        <div class="stat-icon amber">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>
        </div>
        <span class="stat-badge gray">{{ stats.nextShift }}</span>
      </div>
      <div class="stat-label">ON BREAK</div>
      <div class="stat-value">{{ String(stats.onBreak).padStart(2, '0') }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { StaffStats } from './types';
defineProps<{ stats: StaffStats }>();
</script>

<style scoped>
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  background: #131c2e;
  border: 1px solid #1e2d45;
  border-radius: 12px;
  padding: 20px 24px;
  position: relative;
  overflow: hidden;
}

.stat-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.stat-icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.stat-icon.blue  { background: rgba(59,130,246,0.15); color: #60a5fa; }
.stat-icon.teal  { background: rgba(20,184,166,0.15); color: #2dd4bf; }
.stat-icon.amber { background: rgba(245,158,11,0.15); color: #fbbf24; }

.stat-badge {
  font-size: 11px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 20px;
  letter-spacing: 0.3px;
}
.stat-badge.green { background: rgba(34,197,94,0.12); color: #4ade80; }
.stat-badge.gray  { background: rgba(148,163,184,0.1); color: #94a3b8; }

.stat-label {
  font-size: 11px;
  font-weight: 600;
  color: #64748b;
  letter-spacing: 1px;
  text-transform: uppercase;
  margin-bottom: 6px;
}

.stat-value {
  font-family: 'JetBrains Mono', monospace;
  font-size: 42px;
  font-weight: 700;
  color: #f1f5f9;
  line-height: 1;
}

@media (max-width: 768px) {
  .stats-grid { grid-template-columns: 1fr; }
}
</style>