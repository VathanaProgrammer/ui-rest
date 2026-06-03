<script setup lang="ts">
import type { TicketItem } from '../composables/useTicket';

defineProps<{ item: TicketItem }>();
defineEmits<{ (e: 'changeQty', item: TicketItem, delta: number): void }>();
</script>

<template>
  <div class="ticket-row">
    <div class="ticket-row-top">
      <span class="ticket-item-name">{{ item.qty }}x {{ item.name }}</span>
      <span class="ticket-item-total">
        ${{
          (
            (item.price + (item.modifiers?.reduce((s, m) => s + (m.price ?? 0), 0) ?? 0)) *
            item.qty
          ).toFixed(2)
        }}
      </span>
    </div>

    <div v-if="item.modifiers?.length" class="ticket-mods">
      <span
        v-for="mod in item.modifiers"
        :key="mod.label"
        class="mod-tag"
        :class="mod.type === 'add' ? 'mod-add' : 'mod-remove'"
      >
        {{ mod.type === 'add' ? '+' : '-' }} {{ mod.label }}
        <span v-if="mod.price"> (${{ mod.price.toFixed(2) }})</span>
      </span>
    </div>

    <div class="qty-controls">
      <button class="qty-btn" @click="$emit('changeQty', item, -1)">−</button>
      <span class="qty-val">{{ item.qty }}</span>
      <button class="qty-btn" @click="$emit('changeQty', item, 1)">+</button>
    </div>
  </div>
</template>

<style scoped>
.ticket-row {
  background: #0a0f1e;
  border: 1px solid #1e293b;
  border-radius: 10px;
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.ticket-row-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.ticket-item-name {
  font-size: 14px;
  font-weight: 600;
  color: #f1f5f9;
}
.ticket-item-total {
  font-size: 14px;
  font-weight: 700;
  color: #f1f5f9;
}
.ticket-mods {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.mod-tag { font-size: 12px; font-weight: 500; }
.mod-add  { color: #4ade80; }
.mod-remove { color: #f87171; }
.qty-controls {
  display: flex;
  align-items: center;
  gap: 10px;
  align-self: flex-end;
}
.qty-btn {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: 1px solid #1e293b;
  background: #1e293b;
  color: #e2e8f0;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;
  line-height: 1;
}
.qty-btn:hover { background: #334155; }
.qty-val {
  font-size: 14px;
  font-weight: 700;
  min-width: 16px;
  text-align: center;
  color: #f1f5f9;
}
</style>