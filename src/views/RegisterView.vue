<script setup lang="ts">
import { ref } from 'vue'

import GcButton from '@/components/ui/GcButton.vue'
import GcCard from '@/components/ui/GcCard.vue'
import GcPasswordField from '@/components/ui/GcPasswordField.vue'
import { authAPI } from '@/lib/auth'

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const fullName = ref('')
const isLoading = ref(false)
const error = ref('')
const isSignupSuccess = ref(false)

const handleRegister = async () => {
  isLoading.value = true
  error.value = ''

  try {
    if (password.value !== confirmPassword.value) {
      error.value = 'Passwords do not match.'
      return
    }

    const origin = typeof window !== 'undefined' ? window.location.origin : undefined
    const { error: authError } = await authAPI.signUp(email.value, password.value, {
      fullName: fullName.value.trim() || undefined,
      emailRedirectTo: origin ? `${origin}/dashboard` : undefined,
    })

    if (authError) {
      error.value = authError.message
      return
    }

    isSignupSuccess.value = true
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
        <h1 class="text-lg font-medium text-gc-text">
          Create account
        </h1>
        <p class="mt-1 text-sm text-gc-muted">
          Sign up with email and password.
        </p>
      </div>

      <GcCard v-if="isSignupSuccess">
        <p class="text-sm text-gc-muted">
          Check your email to confirm your account if confirmation is enabled in Supabase.
        </p>
        <router-link
          to="/login"
          class="mt-3 inline-block text-sm text-gc-accent hover:underline"
        >
          Back to sign in
        </router-link>
      </GcCard>

      <form
        v-else
        class="space-y-4"
        @submit.prevent="handleRegister"
      >
        <div>
          <label
            for="fullName"
            class="block text-sm text-gc-muted"
          >Name (optional)</label>
          <input
            id="fullName"
            v-model="fullName"
            type="text"
            name="fullName"
            autocomplete="name"
            class="mt-1 block w-full rounded-lg border border-gc-border bg-gc-bg px-3 py-2 text-sm text-gc-text placeholder:text-gc-muted"
          >
        </div>
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
              autocomplete="new-password"
              required
              dense
            />
          </div>
        </div>
        <div>
          <label
            for="confirmPassword"
            class="block text-sm text-gc-muted"
          >Confirm password</label>
          <div class="mt-1">
            <GcPasswordField
              id="confirmPassword"
              v-model="confirmPassword"
              autocomplete="new-password"
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
          {{ isLoading ? 'Creating account…' : 'Create account' }}
        </GcButton>
      </form>

      <p
        v-if="!isSignupSuccess"
        class="text-center text-sm text-gc-muted"
      >
        <router-link
          to="/login"
          class="text-gc-accent hover:underline"
        >
          Already have an account?
        </router-link>
      </p>
    </div>
  </div>
</template>
