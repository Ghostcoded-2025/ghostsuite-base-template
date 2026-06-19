<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import GcButton from '@/components/ui/GcButton.vue'
import type { AdminUserRow } from '@/lib/admin'

const props = defineProps<{
  open: boolean
  user: AdminUserRow | null
  currentUserEmail: string | null
}>()

const emit = defineEmits<{
  close: []
  save: [email: string, roles: string[]]
}>()

const adminChecked = ref(false)
const superAdminChecked = ref(false)
const staffChecked = ref(false)

const isSelf = computed(() => {
  if (!props.user?.email || !props.currentUserEmail) {
    return false
  }
  return props.user.email.toLowerCase() === props.currentUserEmail.toLowerCase()
})

watch(
  () => [props.open, props.user] as const,
  ([open, user]) => {
    if (!open || !user) {
      return
    }
    const roles = new Set(user.roles)
    adminChecked.value = roles.has('admin')
    superAdminChecked.value = roles.has('super_admin')
    staffChecked.value = roles.has('staff')
  },
  { immediate: true }
)

function onSuperAdminChange(checked: boolean) {
  superAdminChecked.value = checked
  if (checked) {
    adminChecked.value = true
  }
}

function onAdminChange(checked: boolean) {
  adminChecked.value = checked
  if (!checked) {
    superAdminChecked.value = false
  }
}

function onStaffChange(checked: boolean) {
  staffChecked.value = checked
}

function handleClose() {
  emit('close')
}

function handleSave() {
  if (!props.user || isSelf.value) {
    return
  }
  const next: string[] = []
  if (adminChecked.value) {
    next.push('admin')
  }
  if (superAdminChecked.value) {
    next.push('super_admin')
  }
  if (staffChecked.value) {
    next.push('staff')
  }
  emit('save', props.user.email, next)
}
</script>

<template>
  <div
    v-if="open && user"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
    role="dialog"
    aria-modal="true"
    aria-labelledby="perm-modal-title"
    @click.self="handleClose"
  >
    <div class="max-h-[90vh] w-full max-w-md overflow-auto rounded-xl border border-gc-border bg-gc-surface p-6 shadow-lg">
      <h2
        id="perm-modal-title"
        class="text-base font-medium text-gc-text"
      >
        Manage permissions
      </h2>
      <p class="mt-1 text-sm text-gc-muted">
        {{ user.email }}
      </p>

      <div
        v-if="isSelf"
        class="mt-4 rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-sm text-amber-100"
      >
        You cannot change your own roles from here.
      </div>

      <div
        v-else
        class="mt-4 space-y-3"
      >
        <label class="flex items-center gap-2 text-sm text-gc-text">
          <input
            type="checkbox"
            class="rounded border-gc-border bg-gc-bg"
            :checked="adminChecked"
            :disabled="isSelf"
            @change="onAdminChange(($event.target as HTMLInputElement).checked)"
          >
          <span>Admin</span>
        </label>
        <label class="flex items-center gap-2 text-sm text-gc-text">
          <input
            type="checkbox"
            class="rounded border-gc-border bg-gc-bg"
            :checked="superAdminChecked"
            :disabled="isSelf"
            @change="onSuperAdminChange(($event.target as HTMLInputElement).checked)"
          >
          <span>Super admin</span>
        </label>
        <label class="flex items-center gap-2 text-sm text-gc-text">
          <input
            type="checkbox"
            class="rounded border-gc-border bg-gc-bg"
            :checked="staffChecked"
            :disabled="isSelf"
            @change="onStaffChange(($event.target as HTMLInputElement).checked)"
          >
          <span>Staff (no admin pages)</span>
        </label>
      </div>

      <div class="mt-6 flex justify-end gap-2">
        <GcButton
          type="button"
          variant="secondary"
          @click="handleClose"
        >
          Cancel
        </GcButton>
        <GcButton
          type="button"
          variant="primary"
          :disabled="isSelf"
          @click="handleSave"
        >
          Save
        </GcButton>
      </div>
    </div>
  </div>
</template>
