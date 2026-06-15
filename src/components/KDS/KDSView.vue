<template>
  <div class="kds-wrapper">
    <!-- Header Controls -->
    <div class="kds-controls">
      <div class="control-group">
        <label>Filter:</label>
        <select v-model="currentFilter" class="kds-select">
          <option value="ACTIVE">Pending (Cooking)</option>
          <option value="READY">Ready (Finished)</option>
          <option value="ALL">All Orders</option>
        </select>
      </div>
    </div>

    <div class="kds-grid">
      <!-- Loading Skeleton -->
      <template v-if="loading">
        <div v-for="i in 6" :key="'skeleton-'+i" class="bg-[#1a1f2b] border border-[#2a3142] rounded-xl overflow-hidden flex flex-col h-[350px]">
          <!-- Header -->
          <div class="h-16 border-b border-[#2a3142] flex justify-between items-center px-4">
            <Skeleton class="w-20 h-6" />
            <Skeleton class="w-16 h-8 rounded-md" />
          </div>
          <!-- Body -->
          <div class="p-4 flex-1 flex flex-col gap-3">
            <div v-for="j in 3" :key="j" class="flex items-center gap-2">
              <Skeleton class="w-6 h-6 rounded" />
              <Skeleton class="h-5 w-3/4" />
            </div>
          </div>
          <!-- Footer -->
          <div class="p-4 border-t border-[#2a3142] flex gap-3">
            <Skeleton class="flex-1 h-12 rounded-lg" />
            <Skeleton class="flex-1 h-12 rounded-lg" />
          </div>
        </div>
      </template>

      <!-- Active Orders -->
      <template v-else>
        <KDSCard
          v-for="order in activeOrders"
          :key="order.id"
          :order="order"
          @bump="bumpOrder"
          @ready="markReady"
        />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import KDSCard from './KDSCard.vue';
import Skeleton from '../ui/Skeleton.vue';
import { useKDS } from './useKDS';

const { activeOrders, currentFilter, bumpOrder, markReady, loading } = useKDS();
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

.kds-controls {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
}

.control-group {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #8a96a4;
  font-weight: 600;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.kds-select {
  background: #161a1f;
  border: 1px solid #252b33;
  color: #dce6f0;
  padding: 8px 12px;
  border-radius: 6px;
  font-family: 'Rajdhani', sans-serif;
  font-weight: 600;
  font-size: 14px;
  outline: none;
  cursor: pointer;
  transition: border-color 0.2s;
}
.kds-select:hover, .kds-select:focus {
  border-color: #4da6ff;
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