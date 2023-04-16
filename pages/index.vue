<script setup lang="ts">
definePageMeta({ requiredLoginStatus: 'loggedIn' })
</script>

<template>
  <div class="d-flex align-center justify-center" style="height: 100vh">
    <h2>Index Page</h2>
    <div>
      <NuxtLink to="/auth/login">Goto Login</NuxtLink>
    </div>
  </div>
</template>
