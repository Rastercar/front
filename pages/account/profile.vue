<script setup lang="ts">
import { useAuthStore } from '~~/store/auth.store'

definePageMeta({ requiredLoginStatus: 'loggedIn' })

const auth = useAuthStore()

const hasGoogleProfile = computed(() =>
  auth.userLinkedProfiles.includes('google')
)

const showOauthDialog = ref(false)
</script>

<template>
  <v-container fluid class="d-flex justify-center align-center h-100">
    <v-row align="center" justify="center">
      <v-card border width="500px" class="elevation-0 pa-4">
        <v-card-title class="d-flex align-center mb-6 pa-0">
          <span class="font-weight-bold text-h4">my profile</span>

          <v-avatar color="grey" size="80" class="ml-auto">
            <!-- TODO: use real image -->
            <v-img
              cover
              src="https://cdn.vuetifyjs.com/images/profiles/marcus.jpg"
            />
          </v-avatar>
        </v-card-title>

        <v-text-field label="Username" />
        <!-- TODO: email verification button ? -->
        <v-text-field label="Email" />
        <v-text-field label="Password" />

        <!-- only master users can have social accounts linked to their rastercar account -->
        <ProfileLinkedSocialAccounts v-if="auth.isMasterUser" />
      </v-card>
    </v-row>
  </v-container>
</template>
