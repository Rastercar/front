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
    <v-btn
      @click="logout"
      class="ml-auto mr-2 mb-2 px-3 text-white"
      color="blue-darken-4"
      variant="flat"
    >
      Log out
    </v-btn>
  </v-app-bar>
</template>
