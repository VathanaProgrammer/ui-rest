<template>
  <div class="kds-wrapper">
    <!-- Header Controls -->
    <div class="kds-controls">
      <div class="control-group">
        <label>Filter:</label>
        <select v-model="currentFilter" class="kds-select">
          <option value="ACTIVE">Pending (Cooking)</option>
          <option value="READY">Bumped (Waiting Delivery)</option>
          <option value="ALL">All Orders</option>
        </select>
      </div>
    </div>

    <!-- Loading Skeleton -->
    <div v-if="loading" class="kds-grid">
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
    </div>

    <!-- Empty State -->
    <div v-else-if="activeOrders.length === 0" class="kds-empty">
      <div class="empty-icon-wrapper">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="empty-icon">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h2>All caught up!</h2>
      <p>No {{ currentFilter === 'READY' ? 'bumped' : currentFilter === 'ACTIVE' ? 'pending' : '' }} orders in the queue.</p>
    </div>

    <!-- Active Orders -->
    <div v-else class="kds-grid">
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
import Skeleton from '../ui/Skeleton.vue';
import { useKDS } from './useKDS';

const { allOrders, activeOrders, currentFilter, bumpOrder, markReady, loading } = useKDS();
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

/* Empty State */
.kds-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100px 20px;
  text-align: center;
  color: #64748b;
  min-height: 50vh;
}

.empty-icon-wrapper {
  background: rgba(30, 41, 59, 0.5);
  border: 1px solid rgba(51, 65, 85, 0.5);
  border-radius: 50%;
  padding: 24px;
  margin-bottom: 24px;
}

.empty-icon {
  width: 48px;
  height: 48px;
  color: #3ecf80;
}

.kds-empty h2 {
  font-size: 28px;
  font-weight: 700;
  color: #f1f5f9;
  margin-bottom: 12px;
  letter-spacing: 0.5px;
}

.kds-empty p {
  font-size: 16px;
  font-weight: 500;
  max-width: 400px;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .kds-grid { grid-template-columns: 1fr; }
}
</style>