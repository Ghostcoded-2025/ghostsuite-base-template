<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

import { useSessionStore } from '@/stores/session'

const sessionStore = useSessionStore()
const { isSuperAdmin, rolesLoaded } = storeToRefs(sessionStore)

const isLoading = computed(() => !rolesLoaded.value)
</script>

<template>
  <div class="mx-auto min-w-0 w-full max-w-3xl px-4 py-8 sm:py-10">
    <h1 class="text-lg font-medium text-gc-text">
      Admin
    </h1>

    <div
      v-if="isLoading"
      class="mt-6 text-sm text-gc-muted"
    >
      Loading…
    </div>

    <ul
      v-else
      class="mt-6 list-inside list-disc space-y-2 text-sm"
    >
      <li v-if="isSuperAdmin">
        <router-link
          to="/admin/management"
          class="text-gc-accent hover:underline"
        >
          Admin management
        </router-link>
      </li>
      <li>
        <router-link
          to="/dashboard"
          class="text-gc-muted hover:text-gc-text"
        >
          Back to dashboard
        </router-link>
      </li>
    </ul>
  </div>
</template>
