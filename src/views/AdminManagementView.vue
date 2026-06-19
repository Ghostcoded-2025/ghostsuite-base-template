<script setup lang="ts">
import { onMounted, ref } from 'vue'

import AdminManagePermissionsModal from '@/components/AdminManagePermissionsModal.vue'
import GcButton from '@/components/ui/GcButton.vue'
import { adminAPI, type AdminUserRow } from '@/lib/admin'
import { authAPI } from '@/lib/auth'
import { useSessionStore } from '@/stores/session'

const currentUserEmail = ref<string | null>(null)
const users = ref<AdminUserRow[]>([])
const search = ref('')
const isLoading = ref(true)
const loadError = ref('')

const modalOpen = ref(false)
const activeUser = ref<AdminUserRow | null>(null)
const saveError = ref('')
const isSaving = ref(false)

const sessionStore = useSessionStore()

async function load() {
  isLoading.value = true
  loadError.value = ''
  try {
    const { data: authData } = await authAPI.getCurrentUser()
    currentUserEmail.value = authData.user?.email ?? null

    const res = await adminAPI.listUsers({
      search: search.value.trim() || undefined,
    })
    users.value = res.users
  } catch (e) {
    loadError.value = e instanceof Error ? e.message : 'Could not load users.'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  void load()
})

function openModal(u: AdminUserRow) {
  saveError.value = ''
  activeUser.value = u
  modalOpen.value = true
}

function closeModal() {
  modalOpen.value = false
  activeUser.value = null
}

async function onSave(email: string, roles: string[]) {
  saveError.value = ''
  isSaving.value = true
  try {
    await adminAPI.setUserRoles(email, roles)
    const selfEmail = currentUserEmail.value?.toLowerCase() ?? ''
    if (selfEmail.length > 0 && email.toLowerCase() === selfEmail) {
      await sessionStore.loadRoles()
    }
    closeModal()
    await load()
  } catch (e) {
    saveError.value = e instanceof Error ? e.message : 'Save failed.'
  } finally {
    isSaving.value = false
  }
}

function isCurrentUserRow(u: AdminUserRow): boolean {
  if (!currentUserEmail.value) {
    return false
  }
  return u.email.toLowerCase() === currentUserEmail.value.toLowerCase()
}
</script>

<template>
  <div class="mx-auto min-w-0 w-full max-w-4xl px-4 py-8 sm:py-10">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <h1 class="text-lg font-medium text-gc-text">
        Admin management
      </h1>
      <router-link
        to="/admin"
        class="text-sm text-gc-muted hover:text-gc-text"
      >
        ← Admin home
      </router-link>
    </div>

    <div class="mt-6 flex flex-wrap items-end gap-3">
      <div>
        <label
          for="admin-management-search"
          class="block text-xs font-medium text-gc-muted"
        >Search email</label>
        <input
          id="admin-management-search"
          v-model="search"
          type="search"
          class="mt-1 w-56 rounded-lg border border-gc-border bg-gc-bg px-2 py-1.5 text-sm text-gc-text placeholder:text-gc-muted"
          @keydown.enter="load"
        >
      </div>
      <GcButton
        type="button"
        variant="primary"
        @click="load"
      >
        Search
      </GcButton>
    </div>

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
      class="mt-6 overflow-x-auto"
    >
      <table class="min-w-full text-left text-sm">
        <thead>
          <tr class="border-b border-gc-border text-gc-muted">
            <th class="py-2 pr-4 font-medium">
              Email
            </th>
            <th class="py-2 pr-4 font-medium">
              Name
            </th>
            <th class="py-2 pr-4 font-medium">
              Roles
            </th>
            <th class="py-2 font-medium" />
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="u in users"
            :key="u.id"
            class="border-b border-gc-border/60"
          >
            <td class="py-2 pr-4 text-gc-text">
              {{ u.email }}
            </td>
            <td class="py-2 pr-4 text-gc-muted">
              {{ u.full_name ?? '—' }}
            </td>
            <td class="py-2 pr-4 text-gc-muted">
              {{ u.roles.length ? u.roles.join(', ') : '—' }}
            </td>
            <td class="py-2">
              <button
                type="button"
                class="text-gc-accent hover:underline disabled:cursor-not-allowed disabled:text-gc-muted"
                :disabled="isCurrentUserRow(u)"
                @click="openModal(u)"
              >
                Manage permissions
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <p
      v-if="saveError"
      class="mt-4 text-sm text-red-400"
    >
      {{ saveError }}
    </p>
    <p
      v-if="isSaving"
      class="mt-2 text-sm text-gc-muted"
    >
      Saving…
    </p>

    <AdminManagePermissionsModal
      :open="modalOpen"
      :user="activeUser"
      :current-user-email="currentUserEmail"
      @close="closeModal"
      @save="onSave"
    />
  </div>
</template>
