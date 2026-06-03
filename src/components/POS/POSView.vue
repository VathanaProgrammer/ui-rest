<script setup lang="ts">
import MenuPanel from './components/MenuPanel.vue';
import TicketPanel from './components/TicketPanel.vue';
import { useTicket } from './composables/useTicket';

const { addItem } = useTicket();
</script>

<template>
  <div class="pos-root">
    <MenuPanel @addItem="addItem" />
    <TicketPanel />
  </div>
</template>

<style scoped>
.pos-root {
  display: flex;
  height: 100%;
  width: 100%;
  background: #0a0f1e;
  color: #e2e8f0;
  font-family: 'DM Sans', 'Segoe UI', sans-serif;
  overflow: hidden;
}
</style>