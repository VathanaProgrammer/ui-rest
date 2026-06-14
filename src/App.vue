<script setup lang="ts">
import OrderAlert from './components/layout/OrderAlert.vue'
import GlobalLoader from './components/layout/GlobalLoader.vue'
</script>

<template>
  <router-view />
  <OrderAlert />
  <GlobalLoader />
</template>
