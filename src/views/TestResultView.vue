<script setup lang="ts">
import { ref } from 'vue'
import { useOrderAlert } from '../composables/useOrderAlert'
import { useApiStream } from '../composables/useApiStream'

const items = ref<string[]>([])
const connectionStatus = ref('Connected - Waiting for events...')

const { showAlert } = useOrderAlert()

const { connectStream } = useApiStream('', 'orders');
connectStream({
  'newItem': (event) => {
    const newItemData = JSON.parse(event.data);
    items.value.unshift(newItemData)
    console.log('Got SSE Event:', newItemData)
    showAlert({
      title: 'New Incoming Data',
      table: 'System',
      orderName: newItemData
    })
  }
})
</script>

<template>
  <div class="result-container">
    <div class="result-card">
      <h2>Live Result Stream (Receiver)</h2>
      
      <div class="status-indicator" :class="{ connected: connectionStatus.startsWith('Connected') }">
        <span class="dot"></span>
        {{ connectionStatus }}
      </div>

      <div class="items-list">
        <transition-group name="list">
          <div v-for="(item, index) in items" :key="index" class="item-row">
            <span class="item-icon">📦</span>
            <span class="item-name">{{ item }}</span>
            <span class="item-time">Just now</span>
          </div>
        </transition-group>
        
        <div v-if="items.length === 0" class="empty-state">
          No items received yet. Go to order-rest /test to send some!
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.result-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100vh;
  padding: 2rem;
  background-color: #f8fafc;
  font-family: 'Inter', sans-serif;
}

.result-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
  width: 100%;
  max-width: 600px;
}

h2 {
  margin-top: 0;
  color: #1e293b;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 1rem;
  margin-bottom: 1rem;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
  font-size: 0.9rem;
  color: #64748b;
  background: #f1f5f9;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  display: inline-flex;
}

.status-indicator.connected {
  color: #047857;
  background: #d1fae5;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #94a3b8;
}

.status-indicator.connected .dot {
  background-color: #10b981;
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
  70% { box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
  100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.item-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.item-icon {
  font-size: 1.5rem;
}

.item-name {
  flex: 1;
  font-weight: 500;
  color: #334155;
  font-size: 1.1rem;
}

.item-time {
  font-size: 0.8rem;
  color: #94a3b8;
  background: #f1f5f9;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #94a3b8;
  border: 2px dashed #e2e8f0;
  border-radius: 8px;
}

/* Vue transition for list items */
.list-enter-active,
.list-leave-active {
  transition: all 0.4s ease;
}
.list-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
