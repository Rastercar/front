<script setup lang="ts">
import { oauthProvider } from '@/store/auth.store'

const auth = useAuthStore()

const hasGoogleProfile = computed(() =>
  auth.userLinkedProfiles.includes('google')
)

const selectedOauthProvider = ref<oauthProvider>('google')

const showRemoveOauthDialog = ref(false)
const showAddOauthDialog = ref(false)

const openOauthModal = (provider: oauthProvider) => {
  selectedOauthProvider.value = provider

  const userHasProvider = auth.userLinkedProfiles.includes(provider)

  showRemoveOauthDialog.value = userHasProvider
  showAddOauthDialog.value = !userHasProvider
}
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
          :icon="hasGoogleProfile ? 'fa fa-cog' : 'fa fa-plus'"
          size="sm"
          class="mb-4"
          :color="hasGoogleProfile ? 'grey-darken-1' : 'green-darken-1'"
          @click="() => openOauthModal('google')"
        />
      </template>
    </v-tooltip>

    <DialogRemoveProfileIntegration
      v-model="showRemoveOauthDialog"
      :oauth-provider-name="selectedOauthProvider"
    />

    <DialogAddProfileIntegration
      v-model="showAddOauthDialog"
      :oauth-provider-name="selectedOauthProvider"
    />
  </div>
</template>
