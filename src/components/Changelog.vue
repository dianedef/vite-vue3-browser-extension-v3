<script setup lang="ts">
import { marked } from 'marked'
import { inject } from 'vue'

const version = inject('__VERSION__', '')
const changelog = inject('__CHANGELOG__', '')
const gitCommit = inject('__GIT_COMMIT__', '')
const gitURL = inject('__GITHUB_URL__', '')
const commitURL = `${gitURL}/commit/${gitCommit}`
</script>

<template>
  <div style="grid-area: content">
    <div
      style="grid-area: version"
      class="self-start"
    >
      <p>
        Version: {{ version }}
        <a
          class="text-green-500"
          :href="commitURL"
          target="_blank"
        >
          (#{{ gitCommit }})
        </a>
      </p>
      <h1>Changelog</h1>
    </div>
    <!-- eslint-disable vue/no-v-html -->
    <div
      class="prose changelog"
      v-html="marked(changelog)"
    />
    <!--eslint-enable-->
  </div>
</template>

<style lang="scss" scoped>
:deep(.changelog) {
  input[type='checkbox'] {
    @apply w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-100;
  }
  table {
    @apply min-w-full divide-y divide-gray-200;
    
    tr:nth-child(odd) {
      @apply bg-gray-50;
    }
    
    tr:nth-child(even) {
      @apply bg-white;
    }
  }
}
</style>
