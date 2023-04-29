<script setup lang="ts">
import { HTTP_STATUS } from '~~/constants/http-status'

type reqStatus =
  | 'wontSend'
  | 'waiting'
  | 'success'
  | 'unauthorized'
  | 'unknownError'

const token = useRoute().query['token']

const requestStatus = ref<reqStatus>(token ? 'waiting' : 'wontSend')

const confirmEmail = () => {
  const { execute } = useApi<string>(`/auth/confirm-email-address`, {
    immediate: false,
    onResponseError: ({ response }) => {
      requestStatus.value =
        response.status === HTTP_STATUS.UNAUTHORIZED
          ? 'unauthorized'
          : 'unknownError'
    },
  })

  execute()
    .then(() => {
      requestStatus.value = 'success'
    })
    .catch(() => null)
}

const messageDict: Record<reqStatus, { title: string; description: string }> = {
  success: {
    title: 'success !',
    description: 'your email address was confirmed',
  },
  waiting: {
    title: 'loading',
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

if (token) setTimeout(confirmEmail, 500)
</script>

<template>
  <div
    class="w-100 h-100 bg-blue text-white text-center d-flex justify-center align-center"
  >
    <div style="max-width: 700px">
      <div class="text-h2">{{ message.title }}</div>
      <div class="text-h4 my-4" style="opacity: 0.5">
        {{ message.description }}
      </div>

      <v-progress-linear
        v-show="requestStatus === 'waiting'"
        indeterminate
        color="white"
        class="mt-4"
      />

      <v-btn
        v-show="requestStatus !== 'waiting'"
        class="w-100 mt-4"
        color="grey"
        style="max-width: 300px"
        @click="navigateTo('/')"
      >
        Go back
      </v-btn>
    </div>
  </div>
</template>
