<script setup lang="ts">
import { useAuthStore } from '~~/store/auth.store'

const authStore = useAuthStore()

const logout = () => {
  authStore.logOut()
  navigateTo('/')
}
</script>

<template>
  <v-app-bar title="Rastercar">
    <AlertAccessingClientPanel v-if="authStore.isMasterUser" />

    <ButtonUserNotifications v-else class="mx-4" />

    <v-btn prepend-icon="fa fa-door-open" variant="outlined" @click="logout">
      Log out
    </v-btn>
  </v-app-bar>
</template>
