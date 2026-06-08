<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRealTime } from '../../../composables/useRealTime';
import { useOrderAlert } from '../../../composables/useOrderAlert';
import { useApiStream } from '../../../composables/useApiStream';

// 1. Create the interface for the menu item response
interface MenuItem {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  category: Category;
  status: string;
}

interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

interface Category {
  id: number;
  categoryName: string;
  imageUrl: string;
  iconColor?: string;
  isActive: boolean;
}

const menuItems = ref<MenuItem[]>([]);
const categories = ref<Category[]>([]);
const loading = ref(true);
const loadingCategories = ref(true);
const errorMsg = ref<string | null>(null);

const { showAlert } = useOrderAlert();

// Use the reusable composable for SSE
useRealTime('/test/stream', {
  'NEW_ORDER': (orderData) => {
    console.log('Real-time new order received:', orderData);
    showAlert({
      title: 'New Order Placed!',
      table: orderData.tableNo,
      orderType: orderData.orderType,
      orderName: orderData.customerName || 'A customer',
      playSound: true
    });
  }
});

const { 
  dataList: rawCategories, 
  fetchData: fetchCategoriesData 
} = useApiStream<any>('http://localhost:7444/api', 'categories');

const { 
  dataList: rawMenuItems, 
  error: menuError,
  fetchData: fetchMenuItemsData 
} = useApiStream<any>('http://localhost:7444/api', 'menu-items');

const fetchMenuItems = async () => {
  loading.value = true;
  errorMsg.value = null;
  
  await fetchMenuItemsData();
  
  if (menuError.value) {
    errorMsg.value = menuError.value;
  } else if ((rawMenuItems.value as any) && (rawMenuItems.value as any).data) {
    menuItems.value = (rawMenuItems.value as any).data;
  } else if ((rawMenuItems.value as any) && (rawMenuItems.value as any).status === 0) {
    errorMsg.value = (rawMenuItems.value as any).message;
  }
  
  loading.value = false;
};

const fetchCategories = async () => {
  await fetchCategoriesData();
  
  if ((rawCategories.value as any) && (rawCategories.value as any).data) {
    categories.value = (rawCategories.value as any).data.filter((c: Category) => c.isActive);
  }
  
  loadingCategories.value = false;
};

onMounted(() => {
  fetchCategories();
  fetchMenuItems();
});
</script>

<template>
  <div class="menu-container">
    <div class="header">
      <h2>Delicious Menu</h2>
      <p>Discover our chef's finest creations</p>
    </div>

    <!-- Categories Section -->
    <div class="categories-section" v-if="!loadingCategories && categories.length > 0">
      <div class="category-list">
        <div v-for="category in categories" :key="category.id" class="category-card">
          <img v-if="category.imageUrl" :src="category.imageUrl" :alt="category.categoryName" class="category-img" loading="lazy" />
          <div v-else class="category-placeholder" :style="{ background: category.iconColor || '#e17055' }"></div>
          <span class="category-name">{{ category.categoryName }}</span>
        </div>
      </div>
    </div>
    
    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Preparing your menu...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="errorMsg" class="error-state">
      <p>⚠️ {{ errorMsg }}</p>
      <button @click="fetchMenuItems" class="retry-btn">Try Again</button>
    </div>

    <!-- Empty State -->
    <div v-else-if="menuItems.length === 0" class="empty-state">
      <p>Our menu is currently being updated. Check back soon!</p>
    </div>

    <!-- Display Data -->
    <div v-else class="menu-grid">
      <div v-for="item in menuItems" :key="item.id" class="menu-card">
        <div class="image-wrapper">
          <img :src="item.imageUrl" :alt="item.name" class="menu-image" loading="lazy" />
          <span v-if="item.category" class="badge" :class="item.category.categoryName.toLowerCase().replace(' ', '-')">
            {{ item.category.categoryName }}
          </span>
        </div>
        <div class="menu-info">
          <div class="title-row">
            <h3 class="menu-name">{{ item.name }}</h3>
            <span class="menu-price">${{ item.price.toFixed(2) }}</span>
          </div>
          <p class="status-text" :class="{ 
              'in-stock': item.status === 'IN STOCK',
              'low-stock': item.status === 'LOW STOCK',
              'unavailable': item.status === 'SOLD OUT' 
            }">
            {{ item.status }}
          </p>
          <button class="add-to-cart" :disabled="item.status === 'SOLD OUT'">
            {{ item.status !== 'SOLD OUT' ? 'Add to Order' : 'Sold Out' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.menu-container {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  color: #2c3e50;
}

.header {
  text-align: center;
  margin-bottom: 3rem;
}

.header h2 {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #ff6b6b, #c0392b);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.header p {
  color: #7f8c8d;
  font-size: 1.1rem;
}

/* States */
.loading-state, .error-state, .empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  text-align: center;
  background: #f8f9fa;
  border-radius: 16px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #ff6b6b;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Categories Layout */
.categories-section {
  margin-bottom: 3rem;
}

.category-list {
  display: flex;
  gap: 1.5rem;
  overflow-x: auto;
  padding: 1rem 0.5rem;
  scroll-snap-type: x mandatory;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
.category-list::-webkit-scrollbar {
  display: none;
}

.category-card {
  flex: 0 0 auto;
  width: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.8rem;
  cursor: pointer;
  scroll-snap-align: start;
  transition: transform 0.3s ease;
}
.category-card:hover {
  transform: translateY(-5px);
}

.category-img, .category-placeholder {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  border: 3px solid white;
}

.category-name {
  font-weight: 600;
  font-size: 0.95rem;
  color: #2c3e50;
  text-align: center;
}

/* Grid Layout */
.menu-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

/* Card Design */
.menu-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  display: flex;
  flex-direction: column;
}

.menu-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(0,0,0,0.1);
}

.image-wrapper {
  position: relative;
  height: 220px;
  width: 100%;
  overflow: hidden;
  background: #f1f2f6;
}

.menu-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.menu-card:hover .menu-image {
  transform: scale(1.05);
}

.badge {
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: rgba(255, 255, 255, 0.9);
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  backdrop-filter: blur(4px);
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.menu-info {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.title-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}

.menu-name {
  font-size: 1.2rem;
  font-weight: 700;
  margin: 0;
  color: #2d3436;
  line-height: 1.3;
}

.menu-price {
  font-weight: 800;
  color: #e17055;
  font-size: 1.3rem;
}

.status-text {
  font-size: 0.9rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  padding: 0.3rem 0.8rem;
  border-radius: 12px;
  display: inline-block;
  align-self: flex-start;
}

.status-text.in-stock {
  color: #27ae60;
  background: rgba(39, 174, 96, 0.1);
  border: 1px solid rgba(39, 174, 96, 0.3);
}

.status-text.low-stock {
  color: #f39c12;
  background: rgba(243, 156, 18, 0.1);
  border: 1px solid rgba(243, 156, 18, 0.3);
}

.status-text.unavailable {
  color: #e74c3c;
  background: rgba(231, 76, 60, 0.1);
  border: 1px solid rgba(231, 76, 60, 0.3);
}

.add-to-cart {
  margin-top: auto;
  width: 100%;
  padding: 1rem;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, #ff6b6b, #c0392b);
  color: white;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.1s;
}

.add-to-cart:hover:not(:disabled) {
  opacity: 0.9;
  transform: scale(0.98);
}

.add-to-cart:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
}

.retry-btn {
  margin-top: 1rem;
  padding: 0.8rem 1.5rem;
  background: #2c3e50;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}
</style>