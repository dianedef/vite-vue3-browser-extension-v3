<script setup lang="ts">
import { inject } from 'vue'

const displayName = inject('__DISPLAY_NAME__', '')
const version = inject('__VERSION__', '')
</script>

<template>
  <div>
    <div
      class="flex flex-col gap-y-4"
      style="grid-area: title"
    >
      <h1 class="text-4xl font-bold text-center">🎉 Updated! 🎉</h1>
      <p class="text-lg">
        {{ displayName }} has been updated to the latest version. 🎉
      </p>
      <p class="text-lg">Version: {{ version }}</p>

      <h1 class="text-2xl font-bold">What's new?</h1>
    </div>

    <p>Icons</p>
    <div>
      <i-fa-solid-dice-five data-test="dice-icon" />
      <i-heroicons-outline:menu-alt-2 data-test="menu-icon" />
      <i-heroicons-outline-menu-alt-2 data-test="menu-icon-alt" />
    </div>

    <Changelog />
  </div>
</template>

<style lang="scss" scoped>
.update-grid {
  grid-template-areas:
    '. . .'
    '. title .'
    '. . .'
    '. content .';
  grid-template-columns: 1fr 4fr 1fr;
  grid-template-rows: 1fr 1fr;
}
</style>
