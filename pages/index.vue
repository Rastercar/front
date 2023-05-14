<script setup lang="ts">
import { useAuthStore } from '~~/store/auth.store'

definePageMeta({
  middleware: [
    function (to, from) {
      const auth = useAuthStore()

      if (auth.isLoggedIn) {
        return auth.isMasterUser
          ? navigateTo('/master')
          : navigateTo('/tracked')
      }
    },
  ],
})
</script>

<template>
  <div class="d-flex align-center justify-center" style="height: 100vh">
    <h2>Index Page</h2>
    <div>
      <NuxtLink to="/auth/login">Goto Login</NuxtLink>
    </div>
  </div>
</template>
