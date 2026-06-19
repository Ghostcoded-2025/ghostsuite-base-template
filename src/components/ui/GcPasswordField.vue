<script setup lang="ts">
import { computed, ref } from 'vue'

const model = defineModel<string>({ required: true })

withDefaults(
  defineProps<{
    id: string
    autocomplete: string
    required?: boolean
    dense?: boolean
  }>(),
  {
    required: false,
    dense: false,
  },
)

const showPlaintext = ref(false)
const inputType = computed(() => (showPlaintext.value ? 'text' : 'password'))
const toggleLabel = computed(() =>
  showPlaintext.value ? 'Hide password' : 'Show password',
)
</script>

<template>
  <div class="relative">
    <input
      :id="id"
      v-model="model"
      :type="inputType"
      :name="id"
      :autocomplete="autocomplete"
      :required="required"
      class="w-full rounded-lg border border-gc-border bg-gc-bg py-2 pl-3 pr-11 text-gc-text placeholder:text-gc-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-gc-accent/40"
      :class="dense ? 'text-sm' : 'text-base'"
    >
    <button
      type="button"
      class="absolute right-2 top-1/2 flex size-9 min-h-[44px] min-w-[44px] -translate-y-1/2 items-center justify-center rounded-md text-gc-muted hover:bg-gc-surface-hover hover:text-gc-text"
      :aria-label="toggleLabel"
      :aria-pressed="showPlaintext"
      @click="showPlaintext = !showPlaintext"
    >
      <FontAwesomeIcon
        :icon="showPlaintext ? 'eye-slash' : 'eye'"
        class="size-[1.05rem]"
        aria-hidden="true"
      />
    </button>
  </div>
</template>
