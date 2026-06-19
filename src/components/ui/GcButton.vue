<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
    type?: 'button' | 'submit'
    disabled?: boolean
  }>(),
  { variant: 'secondary', type: 'button', disabled: false },
)

const cls = computed(() => {
  const base =
    'inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50'
  switch (props.variant) {
    case 'primary':
      return `${base} border border-gc-accent bg-gc-accent text-gc-on-accent hover:bg-gc-accent/90`
    case 'danger':
      return `${base} border border-red-500/50 bg-gc-danger-surface text-gc-danger hover:bg-red-500/20`
    case 'ghost':
      return `${base} border border-transparent text-gc-muted hover:bg-gc-surface-hover hover:text-gc-text`
    default:
      return `${base} border border-gc-border bg-gc-surface-hover text-gc-text hover:bg-gc-border/80`
  }
})
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="cls"
  >
    <slot />
  </button>
</template>
