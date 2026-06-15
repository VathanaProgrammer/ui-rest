<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import MenuItemCard from './MenuItemCard.vue';
import { api } from '../../../utils/api';
import type { MenuItem } from '../composables/useTicket';

const emit = defineEmits<{ (e: 'addItem', item: MenuItem): void }>();

const activeCategory = ref('All Items');
const CATEGORIES = ref<string[]>(['All Items']);
const MENU_ITEMS = ref<MenuItem[]>([]);
const loading = ref(true);

const fetchCategories = async () => {
    try {
        const res = await api.get<any>('/categories');
        if (res.status === 1) {
            CATEGORIES.value = ['All Items', ...res.data.map((c: any) => c.categoryName)];
        }
    } catch(err) {
        console.error(err);
    }
}

const fetchMenuItems = async () => {
    try {
        const res = await api.get<any>('/menu-items');
        if (res.status === 1) {
            MENU_ITEMS.value = res.data
                .filter((item: any) => item.status === 'AVAILABLE') // Only show available items in POS
                .map((item: any) => ({
                    id: item.id.toString(),
                    name: item.name,
                    price: item.price,
                    category: item.category?.categoryName || 'Mains',
                    image: item.imageUrl || 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=400&q=80',
                    color: categoryColor(item.category?.categoryName || 'Mains'),
                }));
        }
    } catch (err) {
        console.error('Failed to fetch menu items:', err);
    }
};

function categoryColor(cat: string) {
  const map: Record<string, string> = { Mains: 'bg-teal-500/10 text-teal-400', Appetizers: 'bg-orange-500/10 text-orange-400', Desserts: 'bg-pink-500/10 text-pink-400', Drinks: 'bg-blue-500/10 text-blue-400', Sides: 'bg-yellow-500/10 text-yellow-400' };
  return map[cat] || 'bg-slate-500/10 text-slate-400';
}

onMounted(async () => {
    loading.value = true;
    await Promise.all([fetchCategories(), fetchMenuItems()]);
    loading.value = false;
});

const filteredItems = computed(() =>
  activeCategory.value === 'All Items'
    ? MENU_ITEMS.value
    : MENU_ITEMS.value.filter((i) => i.category === activeCategory.value)
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