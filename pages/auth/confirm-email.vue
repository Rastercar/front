<script setup lang="ts">
import { HTTP_STATUS } from '~~/constants/http-status'
import { useAuthStore } from '~~/store/auth.store'
import { useNotificationsStore } from '~~/store/notifications.store'

type reqStatus =
  | 'wontSend'
  | 'waiting'
  | 'success'
  | 'unauthorized'
  | 'unknownError'

const token = useRoute().query['token']

const requestStatus = ref<reqStatus>(token ? 'waiting' : 'wontSend')

const authStore = useAuthStore()
const nStore = useNotificationsStore()

const confirmEmail = () => {
  useApi<string>(`/auth/confirm-email-address`, {
    onResponse: ({ response }) => {
      const codeToStatus: Record<string, reqStatus> = {
        [HTTP_STATUS.OK]: 'success',
        [HTTP_STATUS.UNAUTHORIZED]: 'unauthorized',
      }

      requestStatus.value = codeToStatus[response.status] ?? 'unknownError'

      if (requestStatus.value === 'success') {
        authStore.setUserEmailVerified(true)
        nStore.removeClientSideByType('emailVerificationRequired')
      }
    },
  })
}

const messageDict: Record<reqStatus, { title: string; description: string }> = {
  success: {
    title: 'success !',
    description: 'your email address was confirmed',
  },
  waiting: {
    title: 'confirming your email',
    description: 'please wait...',
  },
  unauthorized: {
    title: '401',
    description: 'invalid or expired token',
  },
  wontSend: {
    title: 'error',
    description: 'token not found',
  },
  unknownError: {
    title: 'oops',
    description: 'something went wrong',
  },
}

const message = computed(() => messageDict[requestStatus.value])

onMounted(() => {
  if (token) setTimeout(confirmEmail, 500)
})
</script>

<template>
  <div
    class="w-100 h-100 bg-blue text-center d-flex justify-center align-center"
  >
    <v-card class="pa-4" style="max-width: 700px">
      <v-card-title class="text-h3 py-4">
        {{ message.title }}
      </v-card-title>

      <v-card-subtitle class="text-h5 pt-2">
        {{ message.description }}
      </v-card-subtitle>

      <div v-show="requestStatus === 'waiting'" class="px-4 mt-8">
        <v-progress-linear indeterminate />
      </div>

      <v-card-actions v-show="requestStatus !== 'waiting'">
        <v-btn
          class="w-100 mt-4"
          color="primary"
          variant="elevated"
          prepend-icon="fa fa-home"
          @click="navigateTo('/')"
        >
          Go back
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>
