<template>
  <div class="kds-wrapper">
    <div class="kds-grid">
      <KDSCard
        v-for="order in activeOrders"
        :key="order.id"
        :order="order"
        @bump="bumpOrder"
        @ready="markReady"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import KDSCard from './KDSCard.vue';
import { useKDS } from './useKDS';

const { activeOrders, bumpOrder, markReady } = useKDS();
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Rajdhani:wght@500;600;700&display=swap');
</style>

<style scoped>
.kds-wrapper {
  width: 100%;
  min-height: 100vh;
  background: #0d0f12;
  padding: 20px;
  box-sizing: border-box;
  font-family: 'Rajdhani', sans-serif;
}

.kds-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(300px, 1fr));
  gap: 30px;
}

@media (max-width: 768px) {
  .kds-grid { grid-template-columns: 1fr; }
}
</style>