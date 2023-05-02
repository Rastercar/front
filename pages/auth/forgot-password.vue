<script setup lang="ts">
import useVuelidate from '@vuelidate/core'
import { Socket } from 'socket.io-client'

const isCheckingEmail = ref(false)
const willCheckEmail = ref(false)

const emailStatus = ref<'not_sent' | 'sent' | 'delivered'>('not_sent')

const v = useVuelidate()

const email = ref('')

let emailEventsSocket: Socket | null = null

const onForgotPasswordEmailDelivered = () => {
  console.log('delivered')
  closeWebSocket()
  emailStatus.value = 'delivered'
}

const onForgotPasswordEmailSendingFinished = () => {
  console.log('sent')
  emailStatus.value = 'sent'
}

const closeWebSocket = () => {
  if (!emailEventsSocket) return

  emailEventsSocket.close()
  emailEventsSocket = null
}

const listenToEmailEvents = (emailUuid: string) => {
  console.log('!')
  if (emailEventsSocket !== null) return

  const { socket, onSendingFinished, onDelivery } = useEmailEvents(emailUuid)

  emailEventsSocket = socket

  onSendingFinished(onForgotPasswordEmailSendingFinished)
  onDelivery(onForgotPasswordEmailDelivered)

  setTimeout(closeWebSocket, 20 * 1000)
}

// TODO: finish me !
setTimeout(() => {
  emailStatus.value = 'sent'
}, 1 * 2000)

setTimeout(() => {
  emailStatus.value = 'delivered'
}, 1 * 4000)
</script>

<template>
  <v-container fluid fill-height class="ma-0 pa-0 page-container">
    <v-row align="center" justify="center" class="page-content">
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

        <div v-else>EMAIL STATUS {{ emailStatus }}</div>
      </v-card>
    </v-row>
  </v-container>
</template>
