<script setup lang="ts">
import { useMediaQuery, useScrollLock } from '@vueuse/core'
import { computed, ref, watch, watchEffect } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

import AppLogo from '@/components/AppLogo.vue'
import ThemeToggle from '@/components/ThemeToggle.vue'

defineProps<{
  showAdmin: boolean
  showInstallLink: boolean
}>()

const emit = defineEmits<{ signOut: [] }>()

const route = useRoute()
const isLg = useMediaQuery('(min-width: 1024px)')

const mobileDrawerOpen = ref(false)

const scrollRoot =
  typeof document !== 'undefined' ? document.documentElement : undefined

const scrollLocked = useScrollLock(scrollRoot, false)

watchEffect(() => {
  scrollLocked.value =
    Boolean(scrollRoot) && !isLg.value && mobileDrawerOpen.value
})

watch(isLg, (lg) => {
  if (lg) {
    mobileDrawerOpen.value = false
  }
})

watch(
  () => route.fullPath,
  () => {
    mobileDrawerOpen.value = false
  },
)

const STORAGE_KEY = 'gc-shell-sidebar-expanded'

function readExpandedPreference(): boolean {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw === null) {
      return true
    }
    return raw === 'true'
  } catch {
    return true
  }
}

const sidebarExpanded = ref(typeof localStorage !== 'undefined' ? readExpandedPreference() : true)

watch(sidebarExpanded, (expanded) => {
  try {
    localStorage.setItem(STORAGE_KEY, String(expanded))
  } catch {
    /* ignore quota / private mode */
  }
})

function navLinkClass(active: boolean, expanded: boolean) {
  if (expanded) {
    return [
      'flex min-h-[44px] items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
      active
        ? 'border-l-2 border-gc-accent bg-gc-surface-hover text-gc-text'
        : 'border-l-2 border-transparent text-gc-muted hover:bg-gc-surface-hover hover:text-gc-text',
    ]
  }
  return [
    'flex min-h-[44px] items-center justify-center rounded-lg px-2 py-2.5 text-sm font-medium transition-colors',
    active
      ? 'bg-gc-surface-hover text-gc-text'
      : 'text-gc-muted hover:bg-gc-surface-hover hover:text-gc-text',
  ]
}

const isDashboard = () => route.path === '/dashboard'
const isInstall = () => route.path === '/install-app'
const isAdmin = () => route.path.startsWith('/admin')

const showSidebarLabels = computed(() => !isLg.value || sidebarExpanded.value)
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col bg-gc-bg text-gc-text">
    <button
      v-if="!isLg && mobileDrawerOpen"
      type="button"
      class="fixed inset-0 z-30 bg-black/40 lg:hidden"
      aria-label="Close menu"
      @click="mobileDrawerOpen = false"
    />

    <aside
      class="flex min-h-0 flex-shrink-0 flex-col border-r border-gc-border bg-gc-bg shadow-xl transition-[width,transform] duration-200 ease-out max-lg:fixed max-lg:left-0 max-lg:top-0 max-lg:z-40 max-lg:h-full max-lg:w-56 max-lg:pt-[env(safe-area-inset-top)] lg:z-30 lg:fixed lg:left-0 lg:top-0 lg:h-[100dvh] lg:min-h-0 lg:shadow-none"
      :class="[
        !isLg
          ? mobileDrawerOpen
            ? 'translate-x-0 max-lg:visible'
            : '-translate-x-full pointer-events-none max-lg:invisible'
          : '',
        isLg ? (sidebarExpanded ? 'lg:w-56 lg:translate-x-0 lg:pointer-events-auto lg:visible' : 'lg:w-14 lg:translate-x-0 lg:pointer-events-auto lg:visible') : '',
      ]"
      aria-label="Main navigation"
      :inert="!isLg && !mobileDrawerOpen ? true : undefined"
    >
      <div
        v-if="showSidebarLabels"
        class="border-b border-gc-border px-4 py-4"
      >
        <RouterLink
          to="/dashboard"
          class="block rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-gc-accent"
        >
          <AppLogo
            decorative
            show-label
            height-class="h-9"
          />
          <span class="sr-only">App — home</span>
        </RouterLink>
      </div>
      <div
        v-else
        class="border-b border-gc-border px-2 py-3"
      >
        <RouterLink
          to="/dashboard"
          class="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg hover:bg-gc-surface-hover"
          aria-label="App home"
        >
          <AppLogo
            decorative
            height-class="h-7"
          />
        </RouterLink>
      </div>
      <nav class="flex flex-1 flex-col gap-0.5 p-3">
        <RouterLink
          to="/dashboard"
          :class="navLinkClass(isDashboard(), showSidebarLabels)"
          :title="showSidebarLabels ? undefined : 'Dashboard'"
        >
          <FontAwesomeIcon
            icon="house"
            class="size-[1.125rem] shrink-0"
            aria-hidden="true"
          />
          <span :class="showSidebarLabels ? '' : 'sr-only'">Dashboard</span>
        </RouterLink>
        <RouterLink
          v-if="showInstallLink"
          to="/install-app"
          :class="navLinkClass(isInstall(), showSidebarLabels)"
          :title="showSidebarLabels ? undefined : 'Install app'"
        >
          <FontAwesomeIcon
            icon="download"
            class="size-[1.125rem] shrink-0"
            aria-hidden="true"
          />
          <span :class="showSidebarLabels ? '' : 'sr-only'">Install app</span>
        </RouterLink>
        <RouterLink
          v-if="showAdmin"
          to="/admin"
          :class="navLinkClass(isAdmin(), showSidebarLabels)"
          :title="showSidebarLabels ? undefined : 'Admin'"
        >
          <FontAwesomeIcon
            icon="shield-halved"
            class="size-[1.125rem] shrink-0"
            aria-hidden="true"
          />
          <span :class="showSidebarLabels ? '' : 'sr-only'">Admin</span>
        </RouterLink>
      </nav>
      <div class="mt-auto border-t border-gc-border">
        <div
          v-if="isLg"
          class="flex justify-center border-b border-gc-border p-2"
        >
          <button
            type="button"
            class="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-gc-muted hover:bg-gc-surface-hover hover:text-gc-text"
            :aria-label="sidebarExpanded ? 'Collapse sidebar to icons' : 'Expand sidebar'"
            @click="sidebarExpanded = !sidebarExpanded"
          >
            <FontAwesomeIcon
              :icon="sidebarExpanded ? 'chevron-left' : 'chevron-right'"
              class="size-4"
              aria-hidden="true"
            />
          </button>
        </div>
        <div class="space-y-1 p-3">
          <div
            :class="[
              showSidebarLabels
                ? 'flex items-center gap-2 px-3 py-1'
                : 'flex justify-center py-1',
            ]"
          >
            <ThemeToggle />
            <span
              v-if="showSidebarLabels"
              class="text-sm text-gc-muted"
            >
              Theme
            </span>
          </div>
          <button
            type="button"
            :class="[
              'flex min-h-[44px] w-full items-center rounded-lg text-left text-sm font-medium text-gc-muted hover:bg-gc-surface-hover hover:text-gc-text',
              showSidebarLabels ? 'px-3 py-2.5' : 'justify-center px-2 py-2.5',
            ]"
            :title="showSidebarLabels ? undefined : 'Sign out'"
            @click="emit('signOut')"
          >
            <FontAwesomeIcon
              icon="right-from-bracket"
              class="size-4 shrink-0"
              aria-hidden="true"
            />
            <span :class="showSidebarLabels ? 'ml-3' : 'sr-only'">Sign out</span>
          </button>
        </div>
      </div>
    </aside>

    <div
      class="flex min-h-0 min-w-0 flex-1 flex-col transition-[padding] duration-200 ease-out"
      :class="sidebarExpanded ? 'lg:pl-56' : 'lg:pl-14'"
    >
      <header
        class="sticky top-0 z-20 flex min-h-[calc(3.5rem+env(safe-area-inset-top,0px))] items-center justify-between border-b border-gc-border bg-gc-bg/95 px-4 pt-[env(safe-area-inset-top,0px)] backdrop-blur lg:hidden"
      >
        <RouterLink
          to="/dashboard"
          class="flex min-h-[44px] max-w-[70%] items-center"
          aria-label="App home"
        >
          <AppLogo
            decorative
            height-class="h-7 max-w-full sm:h-8"
          />
        </RouterLink>
        <div class="flex items-center gap-1">
          <ThemeToggle />
          <button
            type="button"
            class="min-h-[44px] min-w-[44px] rounded-lg text-gc-text hover:bg-gc-surface-hover"
            :aria-label="mobileDrawerOpen ? 'Close menu' : 'Open menu'"
            :aria-expanded="mobileDrawerOpen"
            @click="mobileDrawerOpen = !mobileDrawerOpen"
          >
            <FontAwesomeIcon
              icon="bars"
              class="text-lg"
              aria-hidden="true"
            />
          </button>
        </div>
      </header>
      <main class="flex min-h-0 min-w-0 flex-1 touch-pan-y flex-col overflow-x-hidden overflow-y-auto overscroll-y-contain pb-[env(safe-area-inset-bottom)]">
        <div class="flex min-h-0 min-w-0 w-full flex-1 flex-col">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>
