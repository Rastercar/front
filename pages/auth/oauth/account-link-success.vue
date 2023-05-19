<script setup lang="ts">
import { User } from '~~/api/types'

definePageMeta({
  layout: 'default',
  requiredLoginStatus: 'loggedIn',
})

const auth = useAuthStore()

useApi<User>('/auth/me', {
  onResponse({ response }) {
    if (response.ok && response._data) auth.setUser(response._data)
  },
})
</script>

<template>
  <v-container fluid fill-height class="ma-0 pa-0">
    <v-row align="center" justify="center">
      <v-card class="elevation-5">
        <v-card-title class="text-h5 mt-2"> Success </v-card-title>

        <v-card-text class="mt-2">
          your rastercar account has been linked !
          <v-icon icon="fa fa-check" size="large" color="green" />
        </v-card-text>

        <v-card-actions class="pa-4 justify-center">
          <v-btn
            append-icon="fa fa-home"
            color="green"
            variant="elevated"
            class="px-4"
            @click="() => navigateTo('/')"
          >
            go back
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-row>
  </v-container>
</template>
