<script setup lang="ts">
import Sidebar from '../components/layout/Sidebar.vue';
import Header from '../components/layout/Header.vue';
import { useApiStream } from '../composables/useApiStream';
import { useOrderAlert } from '../composables/useOrderAlert';
import { ref, provide } from 'vue';

const isMobileMenuOpen = ref(false);
const toggleMobileMenu = () => { isMobileMenuOpen.value = !isMobileMenuOpen.value; };
provide('isMobileMenuOpen', isMobileMenuOpen);
provide('toggleMobileMenu', toggleMobileMenu);

const { showAlert } = useOrderAlert();
const { connectStream } = useApiStream('', 'orders');

connectStream({
  'NEW_ORDER': (event) => {
    const orderData = JSON.parse(event.data);
    showAlert({
      title: 'New Order Placed!',
      table: orderData.tableNo,
      orderType: orderData.orderType,
      orderName: orderData.customerName || `Order #${orderData.id}`,
      playSound: true
    });
  }
});
</script>

<template>
  <div class="flex h-screen bg-[#0b1121] overflow-hidden font-sans relative">
    
    <!-- Mobile Backdrop Overlay -->
    <div 
      v-if="isMobileMenuOpen" 
      @click="toggleMobileMenu" 
      class="fixed inset-0 bg-black/60 z-[55] md:hidden backdrop-blur-sm transition-opacity"
    ></div>

    <Sidebar />
    <div class="flex-1 flex flex-col min-w-0">
      <Header />
      <main class="flex-1 overflow-auto relative">
        <router-view />
      </main>
    </div>
  </div>
</template>
