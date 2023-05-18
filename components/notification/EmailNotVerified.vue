<script setup lang="ts">
import { useNotificationsStore } from '~~/store/notifications.store'
import { SendEmailResponse } from '~~/api/auth'
import { Socket } from 'socket.io-client'

type status =
  | 'not_sent'
  | 'requesting'
  | 'requested'
  | 'sending_finished'
  | 'delivered'

const notificationStore = useNotificationsStore()

const emailStatus = ref<status>('not_sent')

const authStore = useAuthStore()

const partialUserEmail = authStore.user?.email
  ? authStore.user?.email.replace(/(\w{3})[\w.-]+@([\w.]+\w)/, '$1***@$2')
  : null

const { execute, data, error, pending } = useApi<SendEmailResponse>(
  `/auth/send-email-address-confirmation-email`,
  { immediate: false }
)

const sendAddressConfirmationEmail = () => {
  emailStatus.value = 'requesting'

  withMinimumTime(execute(), 2 * 1000)
    .then(() => {
      if (!data.value) return
      listenToEmailEvents(data.value.emailUuid)
    })
    .finally(() => (emailStatus.value = 'requested'))
}

const statusToColor: Record<status, string> = {
  requesting: 'grey',
  requested: 'primary',
  not_sent: 'orange',
  delivered: 'green',
  sending_finished: 'blue',
}

let emailEventsSocket: Socket | null = null

const closeWebSocket = () => {
  if (!emailEventsSocket) return

  emailEventsSocket.close()
  emailEventsSocket = null
}

const listenToEmailEvents = (emailUuid: string) => {
  if (emailEventsSocket !== null) return

  const { socket, onSendingFinished, onDelivery } = useEmailEvents(emailUuid)

  emailEventsSocket = socket

  onSendingFinished(() => (emailStatus.value = 'sending_finished'))
  onDelivery(() => (emailStatus.value = 'delivered'))

  setTimeout(closeWebSocket, 5 * 1000)
}
</script>

<template>
  <v-list-item lines="three">
    <template v-slot:prepend>
      <v-icon
        icon="fa fa-exclamation-circle"
        class="mr-4"
        :color="error ? 'red' : statusToColor[emailStatus]"
      />
    </template>

    <template v-if="emailStatus === 'not_sent'">
      <v-list-item-title>Unverified Email Address</v-list-item-title>

      <v-list-item-subtitle>
        please verify your email address to secure your account
      </v-list-item-subtitle>

      <v-btn
        size="small"
        rounded="0"
        elevation="0"
        color="green"
        class="mt-4"
        block
        @click="sendAddressConfirmationEmail"
      >
        send confirmation email
      </v-btn>
    </template>

    <div v-else-if="emailStatus === 'requesting'">
      <p class="mb-1">sending email...</p>
      <v-progress-linear indeterminate />
    </div>

    <div v-else-if="error">
      <v-list-item-title>something went wrong</v-list-item-title>

      <v-list-item-subtitle>
        failed to send a email to your email address
        <div class="mt-2 d-flex">
          <v-btn
            size="small"
            rounded="0"
            elevation="0"
            color="primary"
            class="mr-auto"
            prepend-icon="fa fa-refresh"
            @click="sendAddressConfirmationEmail"
          >
            try again
          </v-btn>

          <v-btn
            size="small"
            color="red"
            prepend-icon="fa fa-close"
            rounded="0"
            elevation="0"
            @click="
              () =>
                notificationStore.removeClientSideByType(
                  'emailVerificationRequired'
                )
            "
          >
            ignore
          </v-btn>
        </div>
      </v-list-item-subtitle>
    </div>

    <div v-else>
      <v-list-item-title>Success</v-list-item-title>

      <v-list-item-subtitle>
        A confirmation email was sent was sent to
        {{ partialUserEmail ?? 'your email address' }}
      </v-list-item-subtitle>

      <v-btn
        size="small"
        color="primary"
        class="mt-2"
        prepend-icon="fa fa-close"
        rounded="0"
        elevation="0"
        block
        @click="
          () =>
            notificationStore.removeClientSideByType(
              'emailVerificationRequired'
            )
        "
      >
        close
      </v-btn>
    </div>
  </v-list-item>
</template>
