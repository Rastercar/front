<script setup lang="ts">
defineProps({
  title: {
    type: String,
    required: true,
  },

  message: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <div class="ma-6">
    <div class="text-h5 mb-4">
      <v-icon icon="fa fa-times-circle" color="red" size="md" class="mr-2" />
      {{ title }}
    </div>

    <div class="text-subtitle1 mb-8">
      {{ message }}
    </div>

    <v-btn
      class="w-100 mb-4"
      color="blue"
      label=""
      @click="() => navigateTo('/auth/forgot-password')"
    >
      Send new password reset email
    </v-btn>

    <div class="text-center mt-2 text-body-2">
      Remembered your password ? <NuxtLink to="/">go back to login</NuxtLink>
    </div>
  </div>
</template>
