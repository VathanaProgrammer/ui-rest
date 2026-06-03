<script setup lang="ts">
// ─── TrackingStatsBar ─────────────────────────────────────────────────────────
import type { TrackingStats } from './types'
defineProps<{ stats: TrackingStats }>()
</script>

<template>
  <div class="stats-bar">
    <div class="stat-item">
      <span class="stat-value">{{ stats.avgPrepTime }}</span>
      <span class="stat-label">AVG PREP TIME</span>
    </div>
    <div class="stat-item">
      <span class="stat-value stat-value--green">{{ stats.onTimeRate }}%</span>
      <span class="stat-label">ON-TIME RATE</span>
    </div>
    <div class="stat-item">
      <span class="stat-value">{{ stats.totalOrders }}</span>
      <span class="stat-label">ORDERS TODAY</span>
    </div>
    <div class="stat-item">
      <span class="stat-value">{{ stats.activeStaff }}</span>
      <span class="stat-label">ACTIVE STAFF</span>
    </div>
  </div>
</template>

<style scoped>
.stats-bar {
  display: flex;
  gap: 0;
  background: #131320;
  border: 1px solid #2a2a3e;
  border-radius: 8px;
  overflow: hidden;
}
.stat-item {
  flex: 1;
  padding: 14px 20px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.stat-item + .stat-item { border-left: 1px solid #2a2a3e; }

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #fff;
  font-variant-numeric: tabular-nums;
  line-height: 1;
}
.stat-value--green { color: #00d084; }
.stat-label {
  font-size: 0.65rem;
  color: #555;
  font-weight: 600;
  letter-spacing: 0.08em;
}
</style>