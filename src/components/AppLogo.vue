<script setup lang="ts">
withDefaults(
  defineProps<{
    heightClass?: string
    showLabel?: boolean
    /** When true, hide from assistive tech (parent supplies name, e.g. `aria-label`). */
    decorative?: boolean
  }>(),
  { heightClass: 'h-9', showLabel: false, decorative: false },
)
</script>

<template>
  <span
    class="inline-flex items-center gap-2.5"
    :aria-hidden="decorative ? true : undefined"
  >
    <span
      class="inline-flex shrink-0 items-center justify-center rounded-full border border-gc-border/60 bg-gc-surface font-semibold text-gc-accent"
      :class="heightClass"
      :style="{ aspectRatio: '1 / 1', width: 'auto' }"
    >
      <span class="text-sm leading-none">A</span>
    </span>
    <span
      v-if="showLabel"
      class="text-sm font-medium text-gc-text"
    >
      App
    </span>
  </span>
</template>
