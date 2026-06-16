<script setup lang="ts">
import { Trash2, Send, StickyNote, Clock, Star } from 'lucide-vue-next';
import TicketItemRow from './TicketItemRow.vue';
import { useTicket } from '../composables/useTicket';

const {
  ticketItems,
  isPriority,
  orderType,
  subtotal,
  tax,
  total,
  ticketNote,
  changeQty,
  clearTicket,
  sendToKitchen,
} = useTicket();

const handleAddNote = () => {
  const note = prompt('Add ticket note (e.g., Allergy info):', ticketNote.value);
  if (note !== null) {
    ticketNote.value = note;
  }
};

const handlePayLater = () => {
  if (ticketItems.value.length === 0) {
    alert('Ticket is empty. Add items first.');
    return;
  }
  alert('Order saved! The customer will pay later.');
  clearTicket();
};
</script>

<template>
  <aside class="ticket-panel">
    <!-- Header -->
    <div class="ticket-header">
      <div class="ticket-meta">
        <span class="ticket-title">Current Ticket</span>
        <span class="ticket-sub">TABLE #14 · SERVER: ALEX</span>
      </div>
      <button class="trash-btn" @click="clearTicket">
        <Trash2 class="w-4 h-4" />
      </button>
    </div>

    <!-- Badges -->
    <div class="ticket-badges">
      <button
        class="badge"
        :class="{ 'badge-active': orderType === 'dine-in' }"
        @click="orderType = 'dine-in'"
      >
        DINE-IN
      </button>
      <button
        class="badge badge-priority"
        :class="{ 'badge-active-priority': isPriority }"
        @click="isPriority = !isPriority"
      >
        <Star class="w-3 h-3" /> PRIORITY
      </button>
    </div>

    <!-- Line Items -->
    <div class="ticket-items">
      <TicketItemRow
        v-for="item in ticketItems"
        :key="item.id"
        :item="item"
        @changeQty="changeQty"
      />
      <div v-if="ticketItems.length === 0" class="empty-ticket">
        <Clock class="w-8 h-8 opacity-30" />
        <p>No items yet</p>
      </div>
    </div>

    <!-- Totals -->
    <div class="ticket-totals">
      <div class="totals-row">
        <span>Subtotal</span>
        <span>${{ subtotal.toFixed(2) }}</span>
      </div>
      <div class="totals-row muted">
        <span>Tax (8.5%)</span>
        <span>${{ tax.toFixed(2) }}</span>
      </div>
      <div class="totals-row grand">
        <span>Total</span>
        <span>${{ total.toFixed(2) }}</span>
      </div>
    </div>

    <!-- Actions -->
    <div v-if="ticketNote" class="ticket-note">
      <strong>Note:</strong> {{ ticketNote }}
    </div>

    <div class="ticket-actions">
      <button class="btn-secondary" @click="handlePayLater">Pay Later</button>
      <button class="btn-secondary" @click="handleAddNote">
        <StickyNote class="w-4 h-4" /> Add Note
      </button>
    </div>

    <button class="btn-send" @click="sendToKitchen">
      <Send class="w-4 h-4" />
      Send to Kitchen
    </button>
  </aside>
</template>

<style scoped>
.ticket-panel {
  width: 340px;
  min-width: 320px;
  background: #0f172a;
  border-left: 1px solid #1e293b;
  display: flex;
  flex-direction: column;
  padding: 20px 18px 16px;
  gap: 14px;
  overflow: hidden;
}
.ticket-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}
.ticket-meta {
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.ticket-title {
  font-size: 16px;
  font-weight: 700;
  color: #f1f5f9;
}
.ticket-sub {
  font-size: 11px;
  color: #64748b;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}
.trash-btn {
  background: transparent;
  border: 1px solid #1e293b;
  color: #64748b;
  padding: 7px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
}
.trash-btn:hover {
  background: #ef4444;
  border-color: #ef4444;
  color: #fff;
}
.ticket-badges {
  display: flex;
  gap: 8px;
}
.badge {
  padding: 5px 12px;
  border-radius: 6px;
  border: 1px solid #1e293b;
  background: transparent;
  color: #94a3b8;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 4px;
}
.badge-active {
  background: #1e40af20;
  border-color: #2563eb;
  color: #60a5fa;
}
.badge-priority.badge-active-priority {
  background: #ca8a0420;
  border-color: #ca8a04;
  color: #fbbf24;
}
.ticket-items {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.ticket-items::-webkit-scrollbar { width: 3px; }
.ticket-items::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 4px; }
.empty-ticket {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  flex: 1;
  color: #475569;
  font-size: 13px;
  padding: 40px 0;
}
.ticket-totals {
  border-top: 1px solid #1e293b;
  padding-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.totals-row {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: #94a3b8;
}
.totals-row.muted {
  color: #475569;
  font-size: 12px;
}
.totals-row.grand {
  font-size: 20px;
  font-weight: 800;
  color: #f1f5f9;
  margin-top: 4px;
}
.ticket-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}
.btn-secondary {
  background: #1e293b;
  border: 1px solid #334155;
  color: #94a3b8;
  border-radius: 10px;
  padding: 10px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}
.btn-secondary:hover {
  background: #334155;
  color: #f1f5f9;
}
.btn-send {
  background: #2563eb;
  border: none;
  color: #fff;
  border-radius: 12px;
  padding: 14px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  letter-spacing: 0.02em;
}
.btn-send:hover { background: #1d4ed8; }
.ticket-note {
  background: rgba(234, 179, 8, 0.1);
  color: #eab308;
  padding: 10px 12px;
  border-radius: 8px;
  font-size: 13px;
  margin-bottom: 12px;
  border: 1px solid rgba(234, 179, 8, 0.2);
}
</style>