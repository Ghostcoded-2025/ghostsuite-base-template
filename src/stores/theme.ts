import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import {
  applyTheme,
  getStoredTheme,
  THEME_STORAGE_KEY,
  type ThemeMode,
} from '@/lib/theme'

export const useThemeStore = defineStore('theme', () => {
  const mode = ref<ThemeMode>(getStoredTheme())

  const isLight = computed(() => mode.value === 'light')

  function setMode(next: ThemeMode) {
    mode.value = next
    applyTheme(next)
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next)
    } catch {
      /* ignore quota / private mode */
    }
  }

  function toggle() {
    setMode(mode.value === 'dark' ? 'light' : 'dark')
  }

  return { mode, isLight, setMode, toggle }
})
