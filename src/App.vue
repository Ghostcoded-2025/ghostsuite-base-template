<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'

import AppShellLayout from '@/components/AppShellLayout.vue'
import AppLogo from '@/components/AppLogo.vue'
import ThemeToggle from '@/components/ThemeToggle.vue'
import { authAPI } from '@/lib/auth'
import {
  publicNavPaths,
  replaceWithDashboardIfOnGuestAuthPath,
} from '@/router'
import { useShowInstallNavLink } from '@/lib/pwa'
import { useAccountStore } from '@/stores/account'
import { useSessionStore } from '@/stores/session'

const route = useRoute()
const router = useRouter()
const sessionStore = useSessionStore()
const accountStore = useAccountStore()
const { isAuthenticated, rolesLoaded, canAccessAdmin } =
  storeToRefs(sessionStore)

const isLoading = ref(true)

const bareAuthPaths = new Set(['/login', '/register'])
const isBareAuthPage = computed(() => bareAuthPaths.has(route.path))
const showMainNav = computed(
  () => publicNavPaths.has(route.path) && route.path !== '/install-app',
)
const showAppNav = computed(() => {
  if (!isAuthenticated.value || isBareAuthPage.value) {
    return false
  }
  if (route.path === '/') {
    return false
  }
  return true
})
const showAdminNav = computed(
  () => rolesLoaded.value && canAccessAdmin.value
)

const showInstallNavLink = useShowInstallNavLink()

let unsubscribeAuth: (() => void) | null = null

async function bootstrapAuthenticated() {
  await Promise.all([
    accountStore.refreshProfile(),
    sessionStore.loadRoles(),
  ])
}

function clearAuthenticatedState() {
  sessionStore.clear()
  accountStore.clear()
}

async function applyAuthFromUser() {
  const { data, error } = await authAPI.getCurrentUser()
  const user = data.user
  sessionStore.setFromAuthUser(user && !error ? user : null)

  if (sessionStore.isAuthenticated) {
    await bootstrapAuthenticated()
    replaceWithDashboardIfOnGuestAuthPath(router)
  } else {
    clearAuthenticatedState()
  }
}

onMounted(async () => {
  await applyAuthFromUser()
  isLoading.value = false

  const {
    data: { subscription },
  } = authAPI.onAuthStateChange((event, session) => {
    sessionStore.setFromAuthUser(session?.user ?? null)

    if (!session?.user) {
      clearAuthenticatedState()
      return
    }

    if (event === 'TOKEN_REFRESHED') {
      void accountStore.refreshProfile()
      return
    }

    if (event === 'INITIAL_SESSION') {
      return
    }

    void bootstrapAuthenticated().then(() => {
      replaceWithDashboardIfOnGuestAuthPath(router)
    })
  })
  unsubscribeAuth = () => { subscription.unsubscribe(); }
})

onUnmounted(() => {
  unsubscribeAuth?.()
  unsubscribeAuth = null
})

const handleSignOut = async () => {
  try {
    const { error } = await authAPI.signOut()
    if (error) throw error
    clearAuthenticatedState()
    void router.push('/')
  } catch (e) {
    console.error('Error signing out:', e)
  }
}
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col">
    <div
      v-if="isLoading"
      class="flex min-h-0 flex-1 flex-col items-center justify-center bg-gc-bg"
    >
      <p class="text-sm text-gc-muted">
        Loading…
      </p>
    </div>

    <div
      v-else
      class="relative flex min-h-0 flex-1 flex-col"
    >
      <div
        v-if="isBareAuthPage"
        class="pointer-events-none fixed right-4 top-4 z-50 pt-[env(safe-area-inset-top,0px)]"
      >
        <div class="pointer-events-auto">
          <ThemeToggle />
        </div>
      </div>

      <AppShellLayout
        v-if="showAppNav"
        class="min-h-0 flex-1"
        :show-admin="showAdminNav"
        :show-install-link="showInstallNavLink"
        @sign-out="handleSignOut"
      >
        <RouterView />
      </AppShellLayout>

      <div
        v-else
        class="flex min-h-0 flex-1 flex-col bg-gc-bg text-gc-text"
      >
        <nav
          v-if="showMainNav"
          class="border-b border-gc-border bg-gc-bg"
        >
          <div class="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4">
            <router-link
              to="/"
              class="flex items-end gap-3 leading-none"
            >
              <AppLogo height-class="h-9 sm:h-10" />
              <span class="pb-0.5 text-[10px] font-medium uppercase tracking-wider text-gc-muted">
                by Ghostcoded
              </span>
            </router-link>
            <div class="flex shrink-0 items-center gap-1 sm:gap-2">
              <ThemeToggle />
              <router-link
                v-if="showInstallNavLink"
                to="/install-app"
                class="rounded-lg px-3 py-2 text-sm text-gc-muted transition-colors hover:bg-gc-surface-hover hover:text-gc-text"
              >
                Install app
              </router-link>
              <router-link
                v-if="isAuthenticated"
                to="/dashboard"
                class="rounded-lg border border-gc-accent px-3 py-2 text-sm font-medium text-gc-accent hover:bg-gc-accent/10"
              >
                Go to app
              </router-link>
              <router-link
                v-else
                to="/login"
                class="rounded-lg px-3 py-2 text-sm text-gc-muted transition-colors hover:bg-gc-surface-hover hover:text-gc-text"
              >
                Sign in
              </router-link>
            </div>
          </div>
        </nav>

        <main class="flex min-h-0 min-w-0 flex-1 flex-col overflow-x-hidden overflow-y-auto overscroll-y-contain">
          <div class="flex min-h-0 min-w-0 w-full flex-1 flex-col">
            <RouterView />
          </div>
        </main>
      </div>
    </div>
  </div>
</template>
