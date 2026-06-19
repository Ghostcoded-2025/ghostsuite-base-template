<script setup lang="ts">
defineProps<{
  title?: string
}>()
</script>

<template>
  <div
    class="rounded-2xl border border-gc-border/90 bg-gc-surface/90 p-4 shadow-md shadow-black/25 backdrop-blur-sm sm:p-5"
  >
    <h2
      v-if="title"
      class="text-base font-medium text-gc-text"
    >
      {{ title }}
    </h2>
    <div :class="title ? 'mt-4' : ''">
      <slot />
    </div>
  </div>
</template>
