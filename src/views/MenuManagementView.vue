<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue';
import { api } from '../utils/api';

type MenuManagementItem = {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  status: 'In Stock' | 'Low Stock' | 'Sold Out';
  sku: string;
};

type Modifier = {
  id: number;
  name: string;
  price: number;
};

const categoriesFromApi = ref<any[]>([]);
const CATEGORIES = computed(() => ['All Items', ...categoriesFromApi.value.map(c => c.categoryName)]);
const statuses = ['All Statuses', 'In Stock', 'Low Stock', 'Sold Out'];
const priceRanges = ['All Prices', '< $10', '$10 - $20', '> $20'];

const showAddItemModal = ref(false);
const showEditItemModal = ref(false);
const selectedCategory = ref('All Items');
const selectedStatus = ref('All Statuses');
const selectedPriceRange = ref('All Prices');
const searchQuery = ref('');
const viewMode = ref<'list' | 'grid'>('list');
const selectedItems = ref<number[]>([]);
const currentPage = ref(1);
const itemsPerPage = 4;

const categoryOptions = computed(() => CATEGORIES.value.filter((c: string) => c !== 'All Items'));

const newItem = ref({
  name: '',
  category: categoryOptions.value[0],
  price: 0,
  status: 'In Stock' as MenuManagementItem['status'],
  description: '',
  image: '',
  sku: '',
});

const editItem = ref<MenuManagementItem>({
  id: 0,
  name: '',
  category: categoryOptions.value[0],
  price: 0,
  status: 'In Stock',
  description: '',
  image: '',
  sku: '',
});

const modifiers = ref<Modifier[]>([]);
const newModifier = ref({ name: '', price: 0 });
const showModifierInput = ref(false);
const isDragging = ref(false);

const menuItems = ref<MenuManagementItem[]>([]);

const fetchMenuItems = async () => {
  try {
    const res = await api.get<any>('/menu-items');
    if (res.status === 1) {
      menuItems.value = res.data.map((item: any) => ({
        id: item.id,
        name: item.name,
        description: item.description || '',
        price: item.price,
        category: item.category?.categoryName || 'Mains',
        image: item.imageUrl || 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=400&q=80',
        status: item.status === 'AVAILABLE' ? 'In Stock' : (item.status === 'LOW_STOCK' ? 'Low Stock' : 'Sold Out'),
        sku: `MM-${String(item.id).padStart(4, '0')}`
      }));
    }
  } catch (err) {
    console.error('Failed to fetch menu items:', err);
  }
};

const fetchCategories = async () => {
    try {
        const res = await api.get<any>('/categories');
        if (res.status === 1) {
            categoriesFromApi.value = res.data;
        }
    } catch(err) {
        console.error(err);
    }
}

onMounted(() => {
  fetchCategories();
  fetchMenuItems();
});

const filteredMenuItems = computed(() => {
  return menuItems.value.filter((item) => {
    const categoryMatch = selectedCategory.value === 'All Items' || item.category === selectedCategory.value;
    const statusMatch = selectedStatus.value === 'All Statuses' || item.status === selectedStatus.value;
    const searchMatch = item.name.toLowerCase().includes(searchQuery.value.toLowerCase());
    let priceMatch = true;
    if (selectedPriceRange.value === '< $10') priceMatch = item.price < 10;
    else if (selectedPriceRange.value === '$10 - $20') priceMatch = item.price >= 10 && item.price <= 20;
    else if (selectedPriceRange.value === '> $20') priceMatch = item.price > 20;
    return categoryMatch && statusMatch && searchMatch && priceMatch;
  });
});

const totalPages = computed(() => Math.ceil(filteredMenuItems.value.length / itemsPerPage));
const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredMenuItems.value.slice(start, start + itemsPerPage);
});
const pageNumbers = computed(() => {
  const pages = [];
  for (let i = 1; i <= Math.min(totalPages.value, 3); i++) pages.push(i);
  return pages;
});

function toggleSelect(id: number) {
  const idx = selectedItems.value.indexOf(id);
  if (idx === -1) selectedItems.value.push(id);
  else selectedItems.value.splice(idx, 1);
}
function toggleSelectAll() {
  if (selectedItems.value.length === paginatedItems.value.length) selectedItems.value = [];
  else selectedItems.value = paginatedItems.value.map((i) => i.id);
}
function deleteItem(id: number) {
  if (confirm("Are you sure you want to delete this item?")) {
    api.delete(`/menu-items/${id}`).then(() => {
        menuItems.value = menuItems.value.filter((i) => i.id !== id);
    }).catch(err => console.error(err));
  }
}

function openEditModal(item: MenuManagementItem) {
  editItem.value = { ...item };
  showEditItemModal.value = true;
}

async function saveEditItem() {
  if (!editItem.value.name.trim()) return;
  const backendStatus = editItem.value.status === 'In Stock' ? 'AVAILABLE' : (editItem.value.status === 'Low Stock' ? 'LOW_STOCK' : 'OUT_OF_STOCK');
  
  try {
      const targetCategory = categoriesFromApi.value.find(c => c.categoryName === editItem.value.category);
      await api.put(`/menu-items/${editItem.value.id}`, {
          name: editItem.value.name,
          description: editItem.value.description,
          price: editItem.value.price,
          status: backendStatus,
          imageUrl: editItem.value.image,
          categoryId: targetCategory ? targetCategory.id : 1
      });
      await fetchMenuItems();
      showEditItemModal.value = false;
  } catch (err) {
      console.error(err);
  }
}

async function addNewItem() {
  if (!newItem.value.name.trim()) return;
  const backendStatus = newItem.value.status === 'In Stock' ? 'AVAILABLE' : (newItem.value.status === 'Low Stock' ? 'LOW_STOCK' : 'OUT_OF_STOCK');

  try {
      const targetCategory = categoriesFromApi.value.find(c => c.categoryName === newItem.value.category);
      await api.post(`/menu-items`, {
          name: newItem.value.name,
          description: newItem.value.description,
          price: newItem.value.price,
          status: backendStatus,
          imageUrl: newItem.value.image,
          categoryId: targetCategory ? targetCategory.id : 1
      });
      await fetchMenuItems();
      showAddItemModal.value = false;
      resetNewItem();
  } catch(err) {
      console.error(err);
  }
}

function resetNewItem() {
  newItem.value = { name: '', category: categoryOptions.value[0] || '', price: 0, status: 'In Stock', description: '', image: '', sku: '' };
  modifiers.value = [];
  newModifier.value = { name: '', price: 0 };
  showModifierInput.value = false;
  isDragging.value = false;
}

function addModifier() {
  if (!newModifier.value.name.trim()) return;
  modifiers.value.push({ id: Date.now(), name: newModifier.value.name.trim(), price: Number(newModifier.value.price) || 0 });
  newModifier.value = { name: '', price: 0 };
  showModifierInput.value = false;
}
function removeModifier(id: number) {
  modifiers.value = modifiers.value.filter((m) => m.id !== id);
}

function categoryColor(cat: string) {
  const map: Record<string, string> = { Mains: 'text-teal-400', Appetizers: 'text-orange-400', Desserts: 'text-pink-400', Drinks: 'text-blue-400', Sides: 'text-yellow-400' };
  return map[cat] || 'text-slate-400';
}
function statusClass(status: MenuManagementItem['status']) {
  if (status === 'In Stock') return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30';
  if (status === 'Low Stock') return 'bg-amber-500/10 text-amber-400 border border-amber-500/30';
  return 'bg-red-500/10 text-red-400 border border-red-500/30';
}
function statusDot(status: MenuManagementItem['status']) {
  if (status === 'In Stock') return 'bg-emerald-400';
  if (status === 'Low Stock') return 'bg-amber-400';
  return 'bg-red-400';
}
</script>

<template>
  <div class="p-6 text-slate-100" style="font-family: 'DM Sans', 'Inter', sans-serif;">

    <!-- Page header -->
    <div class="flex items-start justify-between mb-5">
      <div>
        <p class="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Menu Management</p>
        <h1 class="text-xl font-semibold text-white">Menu Management</h1>
        <p class="text-xs text-slate-500 mt-0.5">{{ menuItems.length }} active items in the current menu cycle</p>
      </div>
      <button
        @click="showAddItemModal = true"
        class="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors"
      >
        <span class="text-base leading-none">+</span> Add Item
      </button>
    </div>

    <!-- Filters -->
    <div class="flex flex-wrap items-center gap-2 mb-4">
      <div class="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2 min-w-[200px]">
        <svg class="w-3.5 h-3.5 text-slate-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
        <input v-model="searchQuery" placeholder="Search menu items..." class="bg-transparent text-xs text-slate-300 outline-none placeholder:text-slate-500 w-full" />
      </div>
      <select v-model="selectedCategory" class="rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2 text-xs text-slate-300 outline-none cursor-pointer">
        <option v-for="cat in CATEGORIES" :key="cat" :value="cat">{{ cat }}</option>
      </select>
      <select v-model="selectedStatus" class="rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2 text-xs text-slate-300 outline-none cursor-pointer">
        <option v-for="s in statuses" :key="s" :value="s">{{ s }}</option>
      </select>
      <select v-model="selectedPriceRange" class="rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2 text-xs text-slate-300 outline-none cursor-pointer">
        <option v-for="r in priceRanges" :key="r" :value="r">{{ r }}</option>
      </select>
      <div class="ml-auto flex rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
        <button @click="viewMode = 'list'" :class="['px-2.5 py-2 text-xs transition-colors', viewMode === 'list' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-200']">☰</button>
        <button @click="viewMode = 'grid'" :class="['px-2.5 py-2 text-xs transition-colors', viewMode === 'grid' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-200']">⊞</button>
      </div>
    </div>

    <!-- Table -->
    <div class="rounded-2xl border border-slate-800/80 bg-slate-900/30 overflow-hidden">
      <table class="min-w-full text-left border-separate border-spacing-0">
        <thead>
          <tr class="border-b border-slate-800/80">
            <th class="px-4 py-3 w-10">
              <input type="checkbox" :checked="selectedItems.length === paginatedItems.length && paginatedItems.length > 0" @change="toggleSelectAll" class="rounded border-slate-700 bg-slate-800 w-3.5 h-3.5 accent-indigo-500 cursor-pointer" />
            </th>
            <th class="px-4 py-3 text-[10px] uppercase tracking-widest text-slate-500 font-medium">Image</th>
            <th class="px-4 py-3 text-[10px] uppercase tracking-widest text-slate-500 font-medium">Item Name</th>
            <th class="px-4 py-3 text-[10px] uppercase tracking-widest text-slate-500 font-medium">Category</th>
            <th class="px-4 py-3 text-[10px] uppercase tracking-widest text-slate-500 font-medium">Price</th>
            <th class="px-4 py-3 text-[10px] uppercase tracking-widest text-slate-500 font-medium">Status</th>
            <th class="px-4 py-3 text-[10px] uppercase tracking-widest text-slate-500 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in paginatedItems" :key="item.id" class="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors group">
            <td class="px-4 py-3.5">
              <input type="checkbox" :checked="selectedItems.includes(item.id)" @change="toggleSelect(item.id)" class="rounded border-slate-700 bg-slate-800 w-3.5 h-3.5 accent-indigo-500 cursor-pointer" />
            </td>
            <td class="px-4 py-3.5">
              <img :src="item.image" :alt="item.name" class="w-12 h-10 rounded-xl object-cover" />
            </td>
            <td class="px-4 py-3.5">
              <div class="text-sm font-medium text-white">{{ item.name }}</div>
              <div class="text-[10px] text-slate-500 mt-0.5">ID: #{{ item.sku }}</div>
            </td>
            <td class="px-4 py-3.5">
              <span :class="['text-xs font-semibold uppercase tracking-wide', categoryColor(item.category)]">{{ item.category }}</span>
            </td>
            <td class="px-4 py-3.5">
              <span class="text-sm font-semibold text-teal-400">${{ item.price.toFixed(2) }}</span>
            </td>
            <td class="px-4 py-3.5">
              <span :class="['inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold', statusClass(item.status)]">
                <span :class="['w-1.5 h-1.5 rounded-full', statusDot(item.status)]"></span>
                {{ item.status.toUpperCase() }}
              </span>
            </td>
            <td class="px-4 py-3.5">
              <div class="flex items-center justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                <button @click="openEditModal(item)" class="w-7 h-7 rounded-lg border border-slate-700 bg-slate-800 flex items-center justify-center text-slate-300 hover:bg-slate-700 hover:text-white transition-colors">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                </button>
                <button @click="deleteItem(item.id)" class="w-7 h-7 rounded-lg border border-red-900/40 bg-red-950/30 flex items-center justify-center text-red-400 hover:bg-red-900/40 hover:text-red-300 transition-colors">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="flex items-center justify-between mt-4 px-1">
      <div class="text-xs text-slate-500">
        Showing <span class="text-slate-300 font-medium">{{ (currentPage - 1) * itemsPerPage + 1 }}-{{ Math.min(currentPage * itemsPerPage, filteredMenuItems.length) }}</span>
        of <span class="text-slate-300 font-medium">{{ filteredMenuItems.length }}</span> items
      </div>
      <div class="flex items-center gap-1">
        <button @click="currentPage = Math.max(1, currentPage - 1)" class="w-7 h-7 rounded-lg border border-slate-800 bg-slate-900/60 flex items-center justify-center text-slate-400 hover:text-white transition-colors text-xs">‹</button>
        <button v-for="p in pageNumbers" :key="p" @click="currentPage = p" :class="['w-7 h-7 rounded-lg border text-xs font-medium transition-colors', currentPage === p ? 'border-indigo-500 bg-indigo-600/20 text-indigo-400' : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white']">{{ p }}</button>
        <button v-if="totalPages > 3" class="w-7 h-7 rounded-lg border border-slate-800 bg-slate-900/60 flex items-center justify-center text-slate-400 text-xs">{{ totalPages }}</button>
        <button @click="currentPage = Math.min(totalPages, currentPage + 1)" class="w-7 h-7 rounded-lg border border-slate-800 bg-slate-900/60 flex items-center justify-center text-slate-400 hover:text-white transition-colors text-xs">›</button>
      </div>
    </div>

    <!-- Add Item Modal -->
    <transition name="fade">
      <div
        v-if="showAddItemModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4"
        @click.self="showAddItemModal = false; resetNewItem()"
      >
        <div class="w-full max-w-lg rounded-2xl border border-slate-700/60 bg-[#131929] shadow-2xl overflow-hidden">
          <div class="flex items-center justify-between px-5 py-4 border-b border-slate-700/60">
            <div class="flex items-center gap-2">
              <div class="w-5 h-5 rounded-full border border-indigo-400/60 flex items-center justify-center">
                <span class="text-indigo-400 text-xs leading-none">+</span>
              </div>
              <h2 class="text-sm font-semibold text-white">Add New Menu Item</h2>
            </div>
            <button @click="showAddItemModal = false; resetNewItem()" class="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-white transition-colors text-sm">✕</button>
          </div>
          <div class="px-5 py-4 space-y-4 max-h-[75vh] overflow-y-auto">
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-[10px] uppercase tracking-widest text-slate-400 mb-1.5">Item Name</label>
                <input v-model="newItem.name" type="text" placeholder="e.g. Wagyu Truffle Burger" class="w-full rounded-lg border border-slate-700/60 bg-[#0e1520] px-3 py-2 text-xs text-slate-100 outline-none placeholder:text-slate-600 focus:border-indigo-500/60 transition-colors" />
              </div>
              <div>
                <label class="block text-[10px] uppercase tracking-widest text-slate-400 mb-1.5">Category</label>
                <div class="relative">
                  <select v-model="newItem.category" class="w-full rounded-lg border border-slate-700/60 bg-[#0e1520] px-3 py-2 text-xs text-slate-100 outline-none appearance-none cursor-pointer focus:border-indigo-500/60 transition-colors">
                    <option v-for="cat in categoryOptions" :key="cat" :value="cat">{{ cat }}</option>
                  </select>
                  <svg class="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                </div>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-[10px] uppercase tracking-widest text-slate-400 mb-1.5">Price ($)</label>
                <div class="relative">
                  <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs">$</span>
                  <input v-model.number="newItem.price" type="number" min="0" step="0.01" placeholder="0.00" class="w-full rounded-lg border border-slate-700/60 bg-[#0e1520] pl-6 pr-3 py-2 text-xs text-slate-100 outline-none placeholder:text-slate-600 focus:border-indigo-500/60 transition-colors" />
                </div>
              </div>
              <div>
                <label class="block text-[10px] uppercase tracking-widest text-slate-400 mb-1.5">Stock Status</label>
                <div class="relative">
                  <select v-model="newItem.status" class="w-full rounded-lg border border-slate-700/60 bg-[#0e1520] px-3 py-2 text-xs text-slate-100 outline-none appearance-none cursor-pointer focus:border-indigo-500/60 transition-colors">
                    <option value="In Stock">In Stock</option>
                    <option value="Low Stock">Low Stock</option>
                    <option value="Sold Out">Sold Out</option>
                  </select>
                  <svg class="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                </div>
              </div>
            </div>
            <div>
              <label class="block text-[10px] uppercase tracking-widest text-slate-400 mb-1.5">Description</label>
              <textarea v-model="newItem.description" rows="3" placeholder="Describe the ingredients, preparation, and flavor profile..." class="w-full rounded-lg border border-slate-700/60 bg-[#0e1520] px-3 py-2 text-xs text-slate-100 outline-none placeholder:text-slate-600 resize-none focus:border-indigo-500/60 transition-colors"></textarea>
            </div>
            <div>
              <label class="block text-[10px] uppercase tracking-widest text-slate-400 mb-1.5">Item Image</label>
              <div
                :class="['rounded-xl border-2 border-dashed flex flex-col items-center justify-center py-6 px-4 gap-2 transition-colors cursor-pointer', isDragging ? 'border-indigo-500/60 bg-indigo-500/5' : 'border-slate-700/60 bg-[#0e1520] hover:border-slate-600']"
                @dragover.prevent="isDragging = true"
                @dragleave="isDragging = false"
                @drop.prevent="isDragging = false"
              >
                <svg class="w-7 h-7 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                </svg>
                <p class="text-xs text-slate-300 font-medium">Drag and drop or browse files</p>
                <p class="text-[10px] text-slate-500">PNG, JPG up to 10MB (High res suggested)</p>
              </div>
              <input v-model="newItem.image" type="text" placeholder="Or paste image URL…" class="mt-2 w-full rounded-lg border border-slate-700/60 bg-[#0e1520] px-3 py-2 text-xs text-slate-100 outline-none placeholder:text-slate-600 focus:border-indigo-500/60 transition-colors" />
            </div>
            <div>
              <div class="flex items-center justify-between mb-2">
                <span class="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">Modifiers &amp; Add-ons</span>
                <button @click="showModifierInput = !showModifierInput" class="text-[10px] uppercase tracking-widest text-indigo-400 hover:text-indigo-300 transition-colors font-semibold">+ Add Modifier</button>
              </div>
              <transition name="slide">
                <div v-if="showModifierInput" class="flex gap-2 mb-2">
                  <input v-model="newModifier.name" type="text" placeholder="Modifier name" class="flex-1 rounded-lg border border-slate-700/60 bg-[#0e1520] px-3 py-2 text-xs text-slate-100 outline-none placeholder:text-slate-600 focus:border-indigo-500/60 transition-colors" />
                  <div class="relative w-24">
                    <span class="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs">+$</span>
                    <input v-model.number="newModifier.price" type="number" min="0" step="0.01" placeholder="0.00" class="w-full rounded-lg border border-slate-700/60 bg-[#0e1520] pl-7 pr-2 py-2 text-xs text-slate-100 outline-none focus:border-indigo-500/60 transition-colors" />
                  </div>
                  <button @click="addModifier" class="rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors">Add</button>
                </div>
              </transition>
              <div class="space-y-1.5">
                <div v-for="mod in modifiers" :key="mod.id" class="flex items-center gap-3 rounded-lg border border-slate-700/50 bg-[#0e1520] px-3 py-2.5">
                  <svg class="w-3.5 h-3.5 text-slate-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
                  <span class="flex-1 text-xs text-slate-200">{{ mod.name }}</span>
                  <span class="text-xs font-semibold text-slate-300">+ ${{ mod.price.toFixed(2) }}</span>
                  <button @click="removeModifier(mod.id)" class="w-5 h-5 flex items-center justify-center rounded text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                  </button>
                </div>
                <p v-if="modifiers.length === 0" class="text-xs text-slate-600 italic py-1">No modifiers added yet.</p>
              </div>
            </div>
          </div>
          <div class="flex items-center justify-end gap-2 px-5 py-4 border-t border-slate-700/60">
            <button @click="showAddItemModal = false; resetNewItem()" class="rounded-lg border border-slate-700 bg-transparent px-5 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors">Cancel</button>
            <button @click="addNewItem" class="rounded-lg bg-indigo-600 px-5 py-2 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors">Save Item</button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Edit Item Modal -->
    <transition name="fade">
      <div
        v-if="showEditItemModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4"
        @click.self="showEditItemModal = false"
      >
        <div class="w-full max-w-lg rounded-2xl border border-slate-700/60 bg-[#131929] shadow-2xl overflow-hidden">
          <div class="flex items-center justify-between px-5 py-4 border-b border-slate-700/60">
            <div class="flex items-center gap-2">
              <div class="w-5 h-5 rounded-full border border-amber-400/60 flex items-center justify-center">
                <svg class="w-2.5 h-2.5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
              </div>
              <h2 class="text-sm font-semibold text-white">Edit Menu Item</h2>
            </div>
            <button @click="showEditItemModal = false" class="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-white transition-colors text-sm">✕</button>
          </div>
          <div class="px-5 py-4 space-y-4 max-h-[75vh] overflow-y-auto">
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-[10px] uppercase tracking-widest text-slate-400 mb-1.5">Item Name</label>
                <input v-model="editItem.name" type="text" class="w-full rounded-lg border border-slate-700/60 bg-[#0e1520] px-3 py-2 text-xs text-slate-100 outline-none focus:border-amber-500/60 transition-colors" />
              </div>
              <div>
                <label class="block text-[10px] uppercase tracking-widest text-slate-400 mb-1.5">Category</label>
                <div class="relative">
                  <select v-model="editItem.category" class="w-full rounded-lg border border-slate-700/60 bg-[#0e1520] px-3 py-2 text-xs text-slate-100 outline-none appearance-none cursor-pointer focus:border-amber-500/60 transition-colors">
                    <option v-for="cat in categoryOptions" :key="cat" :value="cat">{{ cat }}</option>
                  </select>
                  <svg class="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                </div>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-[10px] uppercase tracking-widest text-slate-400 mb-1.5">Price ($)</label>
                <div class="relative">
                  <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs">$</span>
                  <input v-model.number="editItem.price" type="number" min="0" step="0.01" class="w-full rounded-lg border border-slate-700/60 bg-[#0e1520] pl-6 pr-3 py-2 text-xs text-slate-100 outline-none focus:border-amber-500/60 transition-colors" />
                </div>
              </div>
              <div>
                <label class="block text-[10px] uppercase tracking-widest text-slate-400 mb-1.5">Stock Status</label>
                <div class="relative">
                  <select v-model="editItem.status" class="w-full rounded-lg border border-slate-700/60 bg-[#0e1520] px-3 py-2 text-xs text-slate-100 outline-none appearance-none cursor-pointer focus:border-amber-500/60 transition-colors">
                    <option value="In Stock">In Stock</option>
                    <option value="Low Stock">Low Stock</option>
                    <option value="Sold Out">Sold Out</option>
                  </select>
                  <svg class="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                </div>
              </div>
            </div>
            <div>
              <label class="block text-[10px] uppercase tracking-widest text-slate-400 mb-1.5">Description</label>
              <textarea v-model="editItem.description" rows="3" class="w-full rounded-lg border border-slate-700/60 bg-[#0e1520] px-3 py-2 text-xs text-slate-100 outline-none placeholder:text-slate-600 resize-none focus:border-amber-500/60 transition-colors"></textarea>
            </div>
            <div>
              <label class="block text-[10px] uppercase tracking-widest text-slate-400 mb-1.5">Item Image URL</label>
              <input v-model="editItem.image" type="text" placeholder="https://example.com/image.jpg" class="w-full rounded-lg border border-slate-700/60 bg-[#0e1520] px-3 py-2 text-xs text-slate-100 outline-none placeholder:text-slate-600 focus:border-amber-500/60 transition-colors" />
              <img v-if="editItem.image" :src="editItem.image" class="mt-2 h-20 w-full object-cover rounded-xl" />
            </div>
            <div>
              <label class="block text-[10px] uppercase tracking-widest text-slate-400 mb-1.5">SKU</label>
              <input v-model="editItem.sku" type="text" class="w-full rounded-lg border border-slate-700/60 bg-[#0e1520] px-3 py-2 text-xs text-slate-100 outline-none focus:border-amber-500/60 transition-colors" />
            </div>
          </div>
          <div class="flex items-center justify-end gap-2 px-5 py-4 border-t border-slate-700/60">
            <button @click="showEditItemModal = false" class="rounded-lg border border-slate-700 bg-transparent px-5 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors">Cancel</button>
            <button @click="saveEditItem" class="rounded-lg bg-amber-600 px-5 py-2 text-xs font-semibold text-white hover:bg-amber-500 transition-colors">Save Changes</button>
          </div>
        </div>
      </div>
    </transition>

  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.slide-enter-active, .slide-leave-active { transition: all 0.15s ease; }
.slide-enter-from, .slide-leave-to { opacity: 0; transform: translateY(-4px); }
</style>