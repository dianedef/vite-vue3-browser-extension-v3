<script setup lang="ts">
import { useToast } from 'primevue/usetoast'

const toast = useToast()

const showToast = () => {
  toast.add({
    severity: 'success',
    summary: 'Succès',
    detail: 'Message de test',
    life: 3000
  })
}
</script>

<template>
  <div>
    <Toast /> <!-- Doit être présent une fois dans votre app -->
    <PButton @click="showToast">Afficher Toast</PButton>
  </div>
</template> 