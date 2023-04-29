<template>
  <div class="text-center">
    <p class="text-grey mb-2">
      Not registered?
      <NuxtLink
        class="text-blue"
        :style="{ cursor: 'pointer' }"
        to="/auth/register"
      >
        create a account
      </NuxtLink>
    </p>

    <NuxtLink
      to="/auth/forgot-password"
      class="text-blue"
      style="text-decoration: none"
    >
      Forgot your password?
    </NuxtLink>
  </div>
</template>
