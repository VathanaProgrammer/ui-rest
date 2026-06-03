<script setup lang="ts">
// ─── TrackingOrderCard ────────────────────────────────────────────────────────
import type { TrackingOrder } from './types'

const props = defineProps<{
  order: TrackingOrder
  elapsedTime: string
}>()

const emit = defineEmits<{
  deliver: [orderId: string]
  notify: [orderId: string]
}>()

const STATUS_LABEL: Record<TrackingOrder['status'], string> = {
  pending: 'PENDING',
  preparing: 'PREPARING',
  ready: 'READY',
  delivered: 'DONE',
  overdue: 'OVERDUE',
}
</script>

<template>
  <div class="order-card" :class="`order-card--${order.status}`">
    <!-- Header -->
    <div class="card-header">
      <span class="table-label">Table {{ String(order.tableNumber).padStart(2, '0') }}</span>
      <div class="timer-block" :class="{ 'timer-block--danger': order.status === 'overdue' }">
        <span class="timer">{{ elapsedTime }}</span>
        <span class="status-badge" :class="`status-badge--${order.status}`">
          {{ STATUS_LABEL[order.status] }}
        </span>
      </div>
    </div>

    <!-- Server -->
    <p class="server-name">Server: {{ order.server }}</p>

    <!-- Items -->
    <ul class="items-list">
      <li
        v-for="item in order.items"
        :key="item.name"
        class="item-row"
        :class="{ 'item-row--rush': item.modifier === 'RUSH' }"
      >
        <span class="item-qty">{{ item.quantity }}x</span>
        <span class="item-name">{{ item.name }}</span>
        <span v-if="item.modifier" class="item-modifier" :class="`item-modifier--${item.modifier?.toLowerCase()}`">
          {{ item.modifier }}
        </span>
      </li>
    </ul>

    <!-- Actions -->
    <div class="card-actions">
      <template v-if="order.status === 'ready'">
        <button class="btn btn--deliver-full" @click="emit('deliver', order.id)">
          MARK AS DELIVERED
        </button>
      </template>
      <template v-else-if="order.status !== 'delivered'">
        <button class="btn btn--ghost" @click="emit('notify', order.id)">Notify</button>
        <button class="btn btn--primary" @click="emit('deliver', order.id)">Deliver</button>
      </template>
      <template v-else>
        <span class="delivered-label">✓ Delivered</span>
      </template>
    </div>
  </div>
</template>

<style scoped>
.order-card {
  background: #1a1a2e;
  border: 1px solid #2a2a3e;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition: border-color 0.2s;
}
.order-card--overdue  { border-color: #ff4444; }
.order-card--ready    { border-color: #00d084; }
.order-card--delivered{ opacity: 0.6; }

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.table-label {
  font-size: 1rem;
  font-weight: 700;
  color: #fff;
}
.timer-block {
  display: flex;
  align-items: center;
  gap: 8px;
}
.timer {
  font-size: 0.95rem;
  font-weight: 600;
  color: #fff;
  font-variant-numeric: tabular-nums;
}
.timer-block--danger .timer { color: #ff4444; }

.status-badge {
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  padding: 2px 6px;
  border-radius: 3px;
}
.status-badge--preparing { color: #4fc3f7; }
.status-badge--overdue   { color: #ff4444; }
.status-badge--ready     { color: #00d084; }
.status-badge--delivered { color: #888; }
.status-badge--pending   { color: #ffd54f; }

.server-name {
  font-size: 0.78rem;
  color: #888;
  margin: 0;
}

.items-list {
  list-style: none;
  margin: 4px 0 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.item-row {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.82rem;
  color: #ccc;
}
.item-row--rush .item-name { color: #ff6b6b; }
.item-qty   { color: #888; min-width: 20px; }
.item-modifier {
  font-size: 0.65rem;
  font-weight: 700;
  padding: 1px 5px;
  border-radius: 3px;
  background: #2a2a3e;
  color: #888;
  letter-spacing: 0.05em;
}
.item-modifier--rush { background: #3d1a1a; color: #ff6b6b; }
.item-modifier--well,
.item-modifier--md   { color: #888; }

.card-actions {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}
.btn {
  flex: 1;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: opacity 0.15s;
}
.btn:hover { opacity: 0.85; }
.btn--ghost   { background: #2a2a3e; color: #ccc; }
.btn--primary { background: #1e88e5; color: #fff; }
.btn--deliver-full {
  background: #00d084;
  color: #000;
  font-weight: 700;
  letter-spacing: 0.05em;
}
.delivered-label {
  font-size: 0.78rem;
  color: #00d084;
  font-weight: 600;
}
</style>