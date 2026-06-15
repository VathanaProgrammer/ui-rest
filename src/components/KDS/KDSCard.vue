<template>
  <div
    class="order-card"
    :class="[`status-${order.status}`, { 'new-order': order.status === 'new' }]"
  >
    <!-- Header -->
    <div class="card-header">
      <div class="card-header-left">
        <span class="ticket-number">{{ order.ticket }}</span>
        <span class="order-type" :class="order.type">{{ order.type }}</span>
      </div>
      <div class="card-header-right">
        <span class="timer" :class="order.status">{{ order.elapsed }}</span>
        <span class="status-label" :class="order.status">{{ order.statusLabel }}</span>
      </div>
    </div>

    <!-- Reservation Info -->
    <div v-if="order.reservationTime" class="reservation-info">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="icon-clock">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>RESERVATION: {{ order.reservationTime }} {{ order.reservationEndTime ? '- ' + order.reservationEndTime : '' }}</span>
    </div>

    <!-- Items -->
    <div class="card-body">
      <div v-for="(item, index) in order.items" :key="index" class="order-item">
        <div class="item-qty">{{ item.qty }}x</div>
        <div class="item-details">
          <div class="item-name">{{ item.name }}</div>
          <div v-if="item.alert"    class="item-alert">!!! {{ item.alert }}</div>
          <div v-if="item.modifier" class="item-modifier">{{ item.modifier }}</div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="card-footer">
      <button class="btn-bump"  @click="$emit('bump',  order.id)">BUMP</button>
      <button class="btn-ready" @click="$emit('ready', order.id)">READY</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Order } from './types';

defineProps<{ order: Order }>();
defineEmits<{
  bump:  [id: number];
  ready: [id: number];
}>();
</script>

<style scoped>
/* ── Card shell ── */
.order-card {
  background: #161a1f;
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  border: 1px solid #252b33;
  transition: transform 0.15s ease;
}
.order-card:hover { transform: translateY(-2px); }

.order-card.status-overdue { border-top: 3px solid #f05050; background: #1a1418; }
.order-card.status-warning { border-top: 3px solid #e8a800; background: #181610; }
.order-card.status-normal  { border-top: 3px solid #3ecf80; }
.order-card.status-new     { border-top: 3px solid #4da6ff; }

.order-card.new-order { animation: pulse-border 1.5s ease-in-out infinite; }

@keyframes pulse-border {
  0%, 100% { box-shadow: 0 0 0 0 rgba(77, 166, 255, 0); }
  50%       { box-shadow: 0 0 0 4px rgba(77, 166, 255, 0.18); }
}

/* ── Card header ── */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 14px 16px 10px;
}
.card-header-left  { display: flex; align-items: center; gap: 10px; }
.card-header-right { display: flex; flex-direction: column; align-items: flex-end; gap: 2px; }

.ticket-number {
  font-size: 22px;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: 1px;
}

.order-type {
  font-size: 11px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.order-type.takeout { background: #f05050; color: #fff; }
.order-type.dine-in { background: #252b33; color: #9aaab8; border: 1px solid #3a4452; }

.timer {
  font-family: 'JetBrains Mono', monospace;
  font-size: 20px;
  font-weight: 600;
  letter-spacing: 1px;
}
.timer.overdue { color: #f05050; }
.timer.warning { color: #e8a800; }
.timer.normal  { color: #3ecf80; }
.timer.new     { color: #4da6ff; }

.status-label {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
}
.status-label.overdue { color: #f05050; }
.status-label.warning { color: #e8a800; }
.status-label.normal  { color: #3ecf80; }
.status-label.new     { color: #4da6ff; }

.status-label.new     { color: #4da6ff; }

/* ── Reservation Info ── */
.reservation-info {
  padding: 0 16px 8px;
  font-size: 11px;
  font-weight: 700;
  color: #8a96a4;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  gap: 6px;
}
.icon-clock {
  width: 14px;
  height: 14px;
}

/* ── Card body ── */
.card-body {
  flex: 1;
  padding: 6px 16px 14px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.order-item { display: flex; gap: 12px; }

.item-qty {
  background: #252b33;
  color: #c0cad6;
  font-size: 13px;
  font-weight: 700;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-family: 'JetBrains Mono', monospace;
}

.item-details { display: flex; flex-direction: column; gap: 2px; padding-top: 4px; }

.item-name     { font-size: 16px; font-weight: 600; color: #dce6f0; line-height: 1.2; }
.item-alert    { font-size: 12px; font-weight: 700; color: #f05050; text-transform: uppercase; letter-spacing: 0.5px; }
.item-modifier { font-size: 13px; color: #6b7480; }

/* ── Card footer ── */
.card-footer {
  display: grid;
  grid-template-columns: 1fr 1fr;
  border-top: 1px solid #252b33;
}

.btn-bump,
.btn-ready {
  padding: 14px;
  font-family: 'Rajdhani', sans-serif;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  border: none;
  cursor: pointer;
  transition: background 0.15s ease;
}

.btn-bump  { background: #1e2329; color: #8a96a4; }
.btn-bump:hover  { background: #252b33; color: #c0cad6; }
.btn-ready { background: #1db864; color: #fff; }
.btn-ready:hover { background: #22d070; }
</style>