<script setup lang="ts">
import OrderAlert from './components/layout/OrderAlert.vue'
import GlobalLoader from './components/layout/GlobalLoader.vue'
import { onMounted } from 'vue'

onMounted(() => {
  // Global click sound effect base
  const baseClickSound = new Audio('/click.mp3');

  document.body.addEventListener('click', () => {
    const soundClone = baseClickSound.cloneNode() as HTMLAudioElement;
    soundClone.volume = 0.4;
    soundClone.play().catch(e => console.warn('Audio playback prevented by browser:', e));
  });
})
</script>

<template>
  <router-view />
  <OrderAlert />
  <GlobalLoader />
</template>
