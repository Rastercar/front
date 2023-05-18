<script setup lang="ts">
const auth = useAuthStore()

const hasGoogleProfile = computed(() =>
  auth.userLinkedProfiles.includes('google')
)

const showOauthDialog = ref(false)
</script>

<template>
  <div>
    <div class="mb-2 font-weight-bold text-h6">Linked Accounts</div>

    <v-tooltip
      :text="
        hasGoogleProfile
          ? 'your rastercar account is linked to your google account'
          : 'link your google account to your rastercar account'
      "
      location="bottom"
    >
      <template v-slot:activator="{ props }">
        <v-icon
          v-bind="props"
          icon="fab fa-google"
          :color="hasGoogleProfile ? 'blue-darken-2' : 'grey-darken-2'"
          size="large"
          class="mr-1"
        />

        <v-icon
          v-if="hasGoogleProfile"
          icon="fa fa-cog"
          size="sm"
          class="mb-4"
          color="grey-darken-1"
          @click="showOauthDialog = !showOauthDialog"
        />
      </template>
    </v-tooltip>

    <DialogRemoveProfileIntegration
      v-model="showOauthDialog"
      oauth-provider-name="google"
    />
  </div>
</template>
