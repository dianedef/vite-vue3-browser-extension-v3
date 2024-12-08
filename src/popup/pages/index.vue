<script setup lang="ts">
import { useAppStore } from '@/stores/app.store'

const version = __VERSION__
const displayName = __DISPLAY_NAME__
const gitURL = __GITHUB_URL__
const gitCommit = __GIT_COMMIT__
const gitCommitURL = `${gitURL}/commit/${gitCommit}`

const store = useAppStore()

const name = computed(() => store.name)
const count = computed(() => store.count)
</script>

<template>
  <div class="text-center m-4 flex flex-col gap-y-2 min-h-[400px] min-w-[400px]">
    <h1 class="text-3xl font-bold underline pb-6">Hello world from Popup!</h1>

    <p>Version: {{ version }}</p>
    <p>Display name: {{ displayName }}</p>

    <p>
      GIT URL:
      <a
        class="undeline text-green-500"
        :href="gitURL"
      >
        {{ gitURL }}
      </a>
    </p>

    <p>
      GIT Commit:
      <a
        :href="gitCommitURL"
        class="text-green-500"
      >
        (#{{ gitCommit }})
      </a>
    </p>

    <p>Name: {{ name }}</p>
    <p>Count: {{ count }}</p>

    <div class="flex gap-x-2 justify-center">
      <PButton
        severity="primary"
        @click="store.increment"
      >
        Increment
      </PButton>
      <PButton
        severity="secondary"
        @click="store.decrement"
      >
        Decrement
      </PButton>
    </div>

    <RouterLink
      class="underline text-blue-500 hover:text-blue-700"
      to="/common/about"
    >
      About
    </RouterLink>
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
