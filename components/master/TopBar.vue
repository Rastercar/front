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
    <ButtonUserNotifications class="mr-2" />

    <v-btn
      class="ml-auto mr-2 px-4"
      prepend-icon="fa fa-door-open"
      variant="outlined"
      @click="logout"
    >
      Log out
    </v-btn>
  </v-app-bar>
</template>
