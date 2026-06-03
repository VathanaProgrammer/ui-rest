<script setup lang="ts">
import type { MenuItem } from '../composables/useTicket';

defineProps<{ item: MenuItem }>();
defineEmits<{ (e: 'add', item: MenuItem): void }>();
</script>

<template>
  <button class="item-card" @click="$emit('add', item)">
    <div class="item-img-wrap">
      <img :src="item.image" :alt="item.name" class="item-img" />
      <span class="item-price">${{ item.price.toFixed(2) }}</span>
    </div>
    <div class="item-info">
      <p class="item-name">{{ item.name }}</p>
      <p class="item-desc">{{ item.description }}</p>
    </div>
  </button>
</template>

<style scoped>
.item-card {
  background: #0f172a;
  border: 1px solid #1e293b;
  border-radius: 14px;
  overflow: hidden;
  cursor: pointer;
  text-align: left;
  transition: border-color 0.2s, transform 0.15s;
  padding: 0;
}
.item-card:hover {
  border-color: #2563eb;
  transform: translateY(-2px);
}
.item-img-wrap {
  position: relative;
  height: 140px;
}
.item-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.item-price {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(10, 15, 30, 0.82);
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  padding: 3px 9px;
  border-radius: 6px;
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.08);
}
.item-info {
  padding: 12px 14px 14px;
}
.item-name {
  font-weight: 700;
  font-size: 14px;
  color: #f1f5f9;
  margin: 0 0 4px;
}
.item-desc {
  font-size: 12px;
  color: #64748b;
  margin: 0;
  line-height: 1.4;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>