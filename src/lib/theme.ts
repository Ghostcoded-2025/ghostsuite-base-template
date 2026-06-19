export type ThemeMode = 'dark' | 'light'

export const THEME_STORAGE_KEY = 'gc-theme'

const THEME_COLORS: Record<ThemeMode, string> = {
  dark: '#0a0a0b',
  light: '#fafafa',
}

export function getStoredTheme(): ThemeMode {
  if (typeof localStorage === 'undefined') {
    return 'dark'
  }
  try {
    const raw = localStorage.getItem(THEME_STORAGE_KEY)
    if (raw === 'light' || raw === 'dark') {
      return raw
    }
  } catch {
    /* ignore quota / private mode */
  }
  return 'dark'
}

export function applyTheme(mode: ThemeMode): void {
  if (typeof document === 'undefined') {
    return
  }

  const root = document.documentElement
  root.classList.remove('theme-dark', 'theme-light')
  root.classList.add(mode === 'light' ? 'theme-light' : 'theme-dark')
  root.style.colorScheme = mode

  const themeColor = THEME_COLORS[mode]
  for (const name of ['theme-color', 'msapplication-TileColor']) {
    const meta = document.querySelector(`meta[name="${name}"]`)
    meta?.setAttribute('content', themeColor)
  }

  const appleStatusBar = document.querySelector(
    'meta[name="apple-mobile-web-app-status-bar-style"]',
  )
  appleStatusBar?.setAttribute(
    'content',
    mode === 'light' ? 'default' : 'black-translucent',
  )
}
