<template>
  <div class="gc-landing relative min-h-dvh overflow-hidden bg-gc-bg text-gc-text">
    <div
      class="gc-landing-mesh pointer-events-none absolute inset-0"
      aria-hidden="true"
    />
    <div class="relative mx-auto flex min-h-dvh w-full max-w-6xl flex-col items-center justify-center px-4 py-16 sm:px-6">
      <div class="w-full max-w-lg space-y-8 text-center">
        <div class="space-y-4">
          <p class="text-[10px] font-semibold uppercase tracking-[0.2em] text-gc-accent">
            Ghostcoded starter
          </p>
          <h1 class="text-3xl font-semibold tracking-tight sm:text-4xl">
            App
          </h1>
          <p class="text-sm leading-relaxed text-gc-muted">
            Starter shell with Ghostsuite styling—swap this page in your fork.
          </p>
        </div>

        <div class="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <router-link
            to="/login"
            class="inline-flex min-h-[44px] items-center justify-center rounded-lg border border-gc-accent bg-gc-accent px-4 py-2 text-sm font-medium text-gc-on-accent hover:bg-gc-accent/90"
          >
            Sign in
          </router-link>
          <router-link
            to="/register"
            class="inline-flex min-h-[44px] items-center justify-center rounded-lg border border-gc-border bg-gc-surface-hover px-4 py-2 text-sm font-medium text-gc-text hover:bg-gc-border/80"
          >
            Create an account
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.gc-landing {
  --landing-accent-soft: rgba(45, 212, 191, 0.14);
}

.gc-landing-mesh {
  background-image:
    radial-gradient(ellipse 120% 80% at 50% -20%, var(--landing-accent-soft), transparent 55%),
    radial-gradient(ellipse 70% 50% at 85% 15%, rgba(45, 212, 191, 0.08), transparent 50%),
    radial-gradient(ellipse 60% 45% at 10% 35%, rgba(13, 148, 136, 0.12), transparent 45%);
}
</style>
