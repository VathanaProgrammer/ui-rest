<script setup lang="ts">
import { ref, computed } from 'vue';
import MenuItemCard from './MenuItemCard.vue';
import { CATEGORIES, MENU_ITEMS } from '../menuData';
import type { MenuItem } from '../composables/useTicket';

const emit = defineEmits<{ (e: 'addItem', item: MenuItem): void }>();

const activeCategory = ref('All Items');

const filteredItems = computed(() =>
  activeCategory.value === 'All Items'
    ? MENU_ITEMS
    : MENU_ITEMS.filter((i) => i.category === activeCategory.value)
);
</script>

<template>
  <div class="menu-panel">
    <!-- Category Tabs -->
    <div class="category-bar">
      <button
        v-for="cat in CATEGORIES"
        :key="cat"
        class="cat-btn"
        :class="{ active: activeCategory === cat }"
        @click="activeCategory = cat"
      >
        {{ cat }}
      </button>
    </div>

    <!-- Item Grid -->
    <div class="item-grid">
      <MenuItemCard
        v-for="item in filteredItems"
        :key="item.id"
        :item="item"
        @add="emit('addItem', $event)"
      />
    </div>
  </div>
</template>

<style scoped>
.menu-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 20px;
  gap: 16px;
}
.category-bar {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.cat-btn {
  padding: 7px 18px;
  border-radius: 999px;
  border: 1px solid #1e293b;
  background: transparent;
  color: #94a3b8;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  letter-spacing: 0.03em;
  text-transform: uppercase;
}
.cat-btn:hover {
  background: #1e293b;
  color: #e2e8f0;
}
.cat-btn.active {
  background: #2563eb;
  border-color: #2563eb;
  color: #fff;
}
.item-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 14px;
  overflow-y: auto;
  padding-right: 4px;
}
.item-grid::-webkit-scrollbar { width: 4px; }
.item-grid::-webkit-scrollbar-track { background: transparent; }
.item-grid::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 4px; }
</style>