<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import GcButton from '@/components/ui/GcButton.vue'
import GcPasswordField from '@/components/ui/GcPasswordField.vue'
import { authAPI } from '@/lib/auth'

const router = useRouter()

const email = ref('')
const password = ref('')
const isLoading = ref(false)
const error = ref('')

const handleLogin = async () => {
  isLoading.value = true
  error.value = ''

  try {
    const { error: authError } = await authAPI.signIn(email.value, password.value)
    if (authError) {
      error.value = authError.message
      return
    }
    void router.push('/dashboard')
  } catch {
    error.value = 'Something went wrong.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="flex min-h-dvh items-center justify-center px-4 py-12">
    <div class="w-full max-w-sm space-y-6">
      <div>
        <h1 class="flex items-center gap-2 text-lg font-medium text-gc-text">
          <FontAwesomeIcon
            icon="right-to-bracket"
            class="text-gc-muted"
            aria-hidden="true"
          />
          Sign in
        </h1>
        <p class="mt-1 text-sm text-gc-muted">
          Use the email and password for your account.
        </p>
      </div>

      <form
        class="space-y-4"
        @submit.prevent="handleLogin"
      >
        <div>
          <label
            for="email"
            class="block text-sm text-gc-muted"
          >Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            name="email"
            autocomplete="email"
            required
            class="mt-1 block w-full rounded-lg border border-gc-border bg-gc-bg px-3 py-2 text-sm text-gc-text placeholder:text-gc-muted"
          >
        </div>
        <div>
          <label
            for="password"
            class="block text-sm text-gc-muted"
          >Password</label>
          <div class="mt-1">
            <GcPasswordField
              id="password"
              v-model="password"
              autocomplete="current-password"
              required
              dense
            />
          </div>
        </div>

        <p
          v-if="error"
          class="text-sm text-red-400"
        >
          {{ error }}
        </p>

        <GcButton
          type="submit"
          variant="primary"
          class="w-full"
          :disabled="isLoading"
        >
          {{ isLoading ? 'Signing in…' : 'Sign in' }}
        </GcButton>
      </form>

      <p class="text-center text-sm text-gc-muted">
        <router-link
          to="/register"
          class="text-gc-accent hover:underline"
        >
          Create an account
        </router-link>
      </p>
    </div>
  </div>
</template>
