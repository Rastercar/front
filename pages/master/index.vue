<script setup lang="ts">
import { ApiSendEmailAddressConfirmationResponse } from '@/api/auth'

definePageMeta({ requiredLoginStatus: 'loggedIn' })

const mockTestConfirmEmail = () => {
  const { execute } = useApi<ApiSendEmailAddressConfirmationResponse>(
    `/auth/send-email-address-confirmation-email`,
    { immediate: false }
  )

  execute().catch(() => null)
}
</script>

<template>
  <div>
    <h2>master dashboard</h2>
    <v-btn @click="mockTestConfirmEmail">send confirmation email</v-btn>
  </div>
</template>
