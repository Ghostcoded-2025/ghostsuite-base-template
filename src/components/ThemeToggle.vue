<script setup lang="ts">
import { storeToRefs } from 'pinia'

import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()
const { isLight } = storeToRefs(themeStore)
</script>

<template>
  <button
    type="button"
    class="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-gc-muted transition-colors hover:bg-gc-surface-hover hover:text-gc-text"
    :aria-label="isLight ? 'Switch to dark mode' : 'Switch to light mode'"
    @click="themeStore.toggle()"
  >
    <FontAwesomeIcon
      :icon="isLight ? 'moon' : 'sun'"
      class="size-4"
      aria-hidden="true"
    />
  </button>
</template>
