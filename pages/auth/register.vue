<script setup lang="ts">
import { useAuthStore } from '@/store/auth.store'
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
    authStore.login({ user, bearerToken: token.value })
    navigateTo('/')
  }
}
</script>

<template>
  <v-card bordered class="q-pa-md shadow-1">
    <v-card-title class="text-center mt-4">Create an Account</v-card-title>

    <v-form>
      <div class="pa-4">
        <RegisterUsernameInput
          v-model="formState.username"
          :loading="isFetchingUser"
          :disable="isFetchingUser"
        />

        <InputUserEmail
          v-model="formState.email"
          v-model:willCheckEmail="willCheckEmail"
          v-model:isCheckingEmail="isCheckingEmail"
          :loading="isFetchingUser"
          :disable="isFetchingUser"
          :emails-in-use="invalidEmails"
        />

        <InputPassword
          v-model="formState.password"
          v-model:visible="isPasswordVisible"
        />

        <InputPasswordConfirmation
          v-model="passwordConfirmation"
          :visible="isPasswordVisible"
          :password-to-match="formState.password"
        />
      </div>

      <v-card-actions class="px-4 flex-row mb-3">
        <div class="col-6 mr-4">
          <v-btn
            class="text-white py-6"
            color="green"
            prepend-icon="fa fa-angle-left"
            block
            @click="() => navigateTo('/')"
          >
            go back
          </v-btn>
        </div>

        <div class="col-6">
          <v-btn
            class="text-white py-6 text-h6"
            color="blue"
            variant="flat"
            block
            :loading="loading"
            :disabled="!canSubmit"
            @click="submitForm"
          >
            CREATE ACCOUNT
          </v-btn>
        </div>
      </v-card-actions>
    </v-form>
  </v-card>
</template>
