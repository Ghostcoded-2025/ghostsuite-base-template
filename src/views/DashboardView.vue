<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

import GcCard from '@/components/ui/GcCard.vue'
import { useAccountStore } from '@/stores/account'
import { useSessionStore } from '@/stores/session'

const sessionStore = useSessionStore()
const accountStore = useAccountStore()
const { authUser } = storeToRefs(sessionStore)
const { profile, profileLoading } = storeToRefs(accountStore)

const email = computed(() => authUser.value?.email ?? null)
const fullName = computed(() => profile.value?.full_name ?? null)

const isLoading = computed(() => profileLoading.value)

const loadError = computed(() => {
  if (profileLoading.value) {
    return ''
  }
  if (!sessionStore.isAuthenticated) {
    return 'Could not load session.'
  }
  if (!profile.value) {
    return 'Could not load profile.'
  }
  return ''
})
</script>

<template>
  <div class="mx-auto min-w-0 w-full max-w-3xl px-4 py-8 sm:py-10">
    <h1 class="text-lg font-medium text-gc-text">
      Dashboard
    </h1>

    <div
      v-if="isLoading"
      class="mt-6 text-sm text-gc-muted"
    >
      Loading…
    </div>

    <div
      v-else-if="loadError"
      class="mt-6 text-sm text-red-400"
    >
      {{ loadError }}
    </div>

    <div
      v-else
      class="mt-6"
    >
      <GcCard>
        <dl class="space-y-3 text-sm">
          <div v-if="email">
            <dt class="text-gc-muted">
              Email
            </dt>
            <dd class="text-gc-text">
              {{ email }}
            </dd>
          </div>
          <div v-if="fullName">
            <dt class="text-gc-muted">
              Name
            </dt>
            <dd class="text-gc-text">
              {{ fullName }}
            </dd>
          </div>
        </dl>
      </GcCard>
    </div>
  </div>
</template>
