<script setup lang="ts">
import { HTTP_STATUS } from '~~/constants/http-status'
import { useAuthStore } from '~~/store/auth.store'
import { ApiLoginResponse } from '~~/api/auth'

const authStore = useAuthStore()
const token = useRoute().query['token']

const error = ref<null | 'unauthorized' | 'other'>(null)
const pending = ref(true)

const attemptLogin = async () => {
  const { data, execute } = useApi<ApiLoginResponse>(
    `auth/login-with-token/${token}`,
    {
      method: 'POST',
      immediate: false,
      onResponseError: ({ response }) => {
        error.value =
          response.status === HTTP_STATUS.UNAUTHORIZED
            ? 'unauthorized'
            : 'other'
      },
    }
  )

  pending.value = true

  await execute().catch(() => null)

  pending.value = false

  if (data.value) {
    const { token, user } = data.value
    authStore.login({ bearerToken: token.value, user: user })
    navigateTo('/')
  }
}

// set a little timeout so the experience is slower enough for the user to catch a glimpse of whats going on
if (token) setTimeout(attemptLogin, 500)
</script>

<template>
  <div
    class="bg-blue text-white text-center d-flex align-center justify-center w-100 h-100"
  >
    <div v-if="!token || error === 'unauthorized'">
      <div class="text-h2">401</div>
      <div class="text-h4" style="opacity: 0.5">unauthorized</div>
      <v-btn color="grey" class="mt-4" @click="() => navigateTo('/auth/login')">
        back to login
      </v-btn>
    </div>

    <div v-else-if="error === 'other'">
      <div class="text-h2">Oops</div>
      <div class="text-h4" style="opacity: 0.5">something went wrong</div>
      <v-btn color="grey" class="mt-4" @click="() => navigateTo('/auth/login')">
        back to login
      </v-btn>
    </div>

    <div v-else>
      <div class="text-h2">logging in</div>
      <div class="text-h4 mt-4" style="opacity: 0.5">
        please wait a second...
      </div>
      <v-progress-linear
        v-show="pending"
        indeterminate
        color="white"
        class="mt-6"
      />
    </div>
  </div>
</template>
