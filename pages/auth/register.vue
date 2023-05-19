<script setup lang="ts">
import { UnregisteredUser } from '@/api/types'
import { ApiLoginResponse } from '@/api/auth'
import { API_ERROR } from '@/api/error-codes'
import useVuelidate from '@vuelidate/core'

definePageMeta({ requiredLoginStatus: 'loggedOff' })

// The uuid of unregistered user to finish the registration for
const uuid = useRoute().query.finishFor as string

const formState = reactive({
  email: '',
  username: '',
  password: '',
  refersToUnregisteredUser: uuid ?? null,
})

const { data: urUser, pending } = useApi<UnregisteredUser>(
  `unregistered-user/${uuid}`,
  { immediate: !!uuid }
)

const isFetchingUser = computed(() => pending.value && !!uuid)

const onUrUserChange = (newUrUser: UnregisteredUser | null) => {
  if (newUrUser === null) return

  formState.email = newUrUser.email ?? ''
  formState.username = newUrUser.username ?? ''
}

watch(urUser, onUrUserChange, { immediate: true, flush: 'sync' })

const isCheckingEmail = ref(false)
const willCheckEmail = ref(false)
const invalidEmails = ref<string[]>([])

const passwordConfirmation = ref('')
const isPasswordVisible = ref(false)

const v = useVuelidate({ $autoDirty: true })

const canSubmit = computed(
  () =>
    !isCheckingEmail.value &&
    !isFetchingUser.value &&
    !willCheckEmail.value &&
    !v.value.$invalid
)

const authStore = useAuthStore()

const loading = ref(false)

const submitForm = async () => {
  const body = { ...formState }

  const { data, execute } = useApi<ApiLoginResponse>(`auth/register`, {
    body,
    method: 'POST',
    immediate: false,
    onResponseError: ({ response: { _data } }) => {
      const emailInUse =
        isApiErrorResponse(_data) && _data.message === API_ERROR.EMAIL_IN_USE

      if (emailInUse) invalidEmails.value.push(body.email)
    },
  })

  loading.value = true

  await execute().finally(() => {
    loading.value = false
  })

  if (data.value) {
    const { user, token } = data.value
    authStore.logIn({ user, bearerToken: token.value })
    navigateTo('/')
  }
}
</script>

<template>
  <v-card bordered class="q-pa-md shadow-1">
    <v-card-title class="text-center mt-4">Create Account</v-card-title>

    <v-form class="pa-6">
      <RegisterUsernameInput
        v-model="formState.username"
        :loading="isFetchingUser"
        :disable="isFetchingUser"
        class="mb-2"
      />

      <InputUserEmail
        v-model="formState.email"
        v-model:willCheckEmail="willCheckEmail"
        v-model:isCheckingEmail="isCheckingEmail"
        :loading="isFetchingUser"
        :disable="isFetchingUser"
        :emails-in-use="invalidEmails"
        class="mb-2"
      />

      <InputPassword
        v-model="formState.password"
        v-model:visible="isPasswordVisible"
        class="mb-2"
      />

      <InputPasswordConfirmation
        v-model="passwordConfirmation"
        :visible="isPasswordVisible"
        :password-to-match="formState.password"
      />
    </v-form>

    <v-card-actions class="px-6 mb-3">
      <v-btn
        color="blue"
        variant="flat"
        prepend-icon="fa fa-angle-left"
        @click="() => navigateTo('/')"
        class="mr-3"
      >
        go back
      </v-btn>

      <v-btn
        color="primary"
        variant="flat"
        :loading="loading"
        :disabled="!canSubmit"
        @click="submitForm"
      >
        create account
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
