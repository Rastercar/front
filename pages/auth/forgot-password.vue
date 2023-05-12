<script setup lang="ts">
import useVuelidate from '@vuelidate/core'
import { Socket } from 'socket.io-client'

type status = 'not_sent' | 'sending' | 'sending_finished' | 'delivered'

const emailStatus = ref<status>('not_sent')
const isCheckingEmail = ref(false)
const willCheckEmail = ref(false)
const email = ref('')

const v = useVuelidate()

let emailEventsSocket: Socket | null = null

const closeWebSocket = () => {
  if (!emailEventsSocket) return

  emailEventsSocket.close()
  emailEventsSocket = null
}

const listenToEmailEvents = (emailUuid: string) => {
  if (emailEventsSocket !== null) return

  emailStatus.value = 'sending'

  const { socket, onSendingFinished, onDelivery } = useEmailEvents(emailUuid)

  emailEventsSocket = socket

  onSendingFinished(() => (emailStatus.value = 'sending_finished'))

  onDelivery(() => {
    closeWebSocket()
    emailStatus.value = 'delivered'
  })

  setTimeout(closeWebSocket, 20 * 1000)
}
</script>

<template>
  <v-container fluid fill-height class="ma-0 pa-0">
    <v-row align="center" justify="center">
      <v-card class="elevation-5 mx-auto" style="max-width: 500px">
        <template v-if="emailStatus === 'not_sent'">
          <v-card-title class="mx-1 mt-4">Forgot your password ?</v-card-title>

          <v-card-subtitle class="mx-1">
            Enter your account's email address to receive a reset password link
          </v-card-subtitle>

          <InputUserEmail
            class="mt-4 mx-4 mb-4"
            v-model="email"
            v-model:willCheckEmail="willCheckEmail"
            v-model:isCheckingEmail="isCheckingEmail"
            valid-if="email-in-use"
          />

          <div class="mx-4">
            <ButtonResetPassword
              :email-address="email"
              :disabled="willCheckEmail || isCheckingEmail || v.$invalid"
              :max-email-requests="1"
              initial-label="send reset password email"
              class="text-none mb-4 w-100"
              size="large"
              @reset-password-email-sending:sent="listenToEmailEvents"
            />
          </div>
        </template>

        <ForgotPasswordEmailSentMessage v-else :email-status="emailStatus" />
      </v-card>
    </v-row>
  </v-container>
</template>
