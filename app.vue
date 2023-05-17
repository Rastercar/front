<script setup lang="ts">
import { useAuthStore } from './store/auth.store'

const authStore = useAuthStore()

const route = useRoute()

const layout = computed(() => {
  if (!authStore.isLoggedIn) {
    return 'default'
  }

  if (route.meta.layout) return route.meta.layout

  return authStore.isMasterUser ? 'master-dashboard' : 'tracked-dashboard'
})
</script>

<template>
  <v-app>
    <NuxtLayout :name="layout" />
  </v-app>
</template>

<style lang="scss">
@use './settings';
</style>
