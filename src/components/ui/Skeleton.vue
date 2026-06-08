<script setup lang="ts">
defineProps<{
  class?: string;
}>();
</script>

<template>
  <div :class="['animate-pulse bg-slate-700/50 rounded-md', $props.class]"></div>
</template>
