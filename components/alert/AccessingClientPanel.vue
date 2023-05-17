<script setup lang="ts">
import { useAuthStore } from '~~/store/auth.store'

const authStore = useAuthStore()
</script>

<template>
  <v-alert type="info" variant="tonal" :icon="false">
    <div class="d-flex align-center">
      <v-icon icon="fa fa-info-circle" class="mr-3" />
      <div>
        you are accessing the panel for the client:
        {{ authStore.organization?.name ?? '' }}
      </div>

      <v-btn
        class="ml-auto mr-2 px-4"
        prepend-icon="fa fa-arrow-left"
        variant="outlined"
        color="black"
        @click="() => navigateTo('/master')"
      >
        back to main panel
      </v-btn>
    </div>
  </v-alert>
</template>
