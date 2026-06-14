<script setup lang="ts">
import OrderAlert from './components/layout/OrderAlert.vue'
import GlobalLoader from './components/layout/GlobalLoader.vue'
import { onMounted } from 'vue'

onMounted(() => {
  // Global click sound effect
  const clickSound = new Audio('/click.mp3');
  clickSound.volume = 0.4;

  document.body.addEventListener('click', () => {
    clickSound.currentTime = 0;
    clickSound.play().catch(e => console.warn('Audio playback prevented by browser:', e));
  });
})
</script>

<template>
  <router-view />
  <OrderAlert />
  <GlobalLoader />
</template>
