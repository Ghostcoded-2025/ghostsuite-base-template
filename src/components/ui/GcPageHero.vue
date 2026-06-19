<script setup lang="ts">
import { computed, useSlots } from 'vue'

const props = withDefaults(
  defineProps<{
    eyebrow?: string
    title: string
    description?: string
    decor?: boolean
    contain?: boolean
  }>(),
  {
    eyebrow: '',
    description: '',
    decor: true,
    contain: true,
  },
)

const slots = useSlots()
const showToolbar = computed(() => Boolean(slots.toolbar))
const showActions = computed(() => Boolean(slots.actions))
const showDescriptionSlot = computed(() => Boolean(slots.description))
const showEyebrow = computed(() => props.eyebrow.trim().length > 0)
</script>

<template>
  <div
    :class="
      contain
        ? 'mx-auto min-w-0 w-full max-w-6xl px-4 pb-6 pt-6 sm:pt-8'
        : 'pb-6 pt-2 sm:pt-4'
    "
  >
    <div
      class="relative overflow-hidden rounded-2xl border border-gc-border/90 bg-gradient-to-b from-gc-surface via-gc-bg to-gc-bg p-6 shadow-[0_24px_80px_-32px_rgba(0,0,0,0.85)] sm:p-8"
    >
      <div
        v-if="decor"
        class="pointer-events-none absolute -right-28 -top-32 h-80 w-80 rounded-full bg-gc-accent/[0.12] blur-3xl"
        aria-hidden="true"
      />
      <div
        v-if="decor"
        class="pointer-events-none absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-gc-accent-muted/10 blur-3xl"
        aria-hidden="true"
      />

      <div class="relative flex flex-col gap-6">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div class="min-w-0 space-y-3">
            <p
              v-if="showEyebrow"
              class="text-[10px] font-semibold uppercase tracking-[0.2em] text-gc-accent"
            >
              {{ eyebrow }}
            </p>
            <h1 class="text-2xl font-semibold tracking-tight text-gc-text sm:text-3xl">
              {{ title }}
            </h1>
            <div
              v-if="showDescriptionSlot || description"
              class="max-w-xl text-sm leading-relaxed text-gc-muted"
            >
              <slot name="description">
                {{ description }}
              </slot>
            </div>
          </div>
          <div
            v-if="showActions"
            class="flex shrink-0 flex-wrap items-center gap-2 self-start sm:justify-end"
          >
            <slot name="actions" />
          </div>
        </div>

        <div
          v-if="showToolbar"
          class="flex flex-col gap-3 border-t border-gc-border/60 pt-6 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
        >
          <slot name="toolbar" />
        </div>
      </div>
    </div>
  </div>
</template>
