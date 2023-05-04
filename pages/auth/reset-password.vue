<script setup lang="ts">
import { HTTP_STATUS } from '~~/constants/http-status'
import useVuelidate from '@vuelidate/core'

type requestStatus =
  | 'loading'
  | 'success'
  | 'not-sent'
  | 'unauthorized'
  | 'unknown-error'

const reqStatus = ref<requestStatus>('not-sent')
const newPasswordConfirmation = ref('')
const passwordVisibility = ref(false)
const newPassword = ref('')

const v = useVuelidate()

const {
  query: { token: passwordResetToken },
} = useRoute()

const resetPassword = () => {
  if (reqStatus.value === 'loading') return

  reqStatus.value = 'loading'

  useApi<string>(`/auth/reset-password`, {
    method: 'POST',
    body: { password: newPassword.value, passwordResetToken },
    onResponse: ({ response }) => {
      const ok =
        response.status === HTTP_STATUS.OK ||
        response.status === HTTP_STATUS.CREATED

      if (ok) {
        reqStatus.value = 'success'
        return
      }

      reqStatus.value =
        response.status === HTTP_STATUS.UNAUTHORIZED
          ? 'unauthorized'
          : 'unknown-error'
    },
  })
}
</script>

<template>
  <v-container fluid fill-height class="ma-0 pa-0">
    <v-row align="center" justify="center">
      <v-card style="width: 500px">
        <template v-if="reqStatus === 'loading' || reqStatus === 'not-sent'">
          <v-toolbar color="#355C7D" class="mb-4" flat>
            <v-card-title class="text-white w-100 text-center">
              Redefine password
            </v-card-title>
          </v-toolbar>

          <v-card-subtitle>
            Please inform and confirm your new password
          </v-card-subtitle>

          <div class="mx-4 mb-6 mt-4">
            <InputPassword
              v-model="newPassword"
              v-model:visible="passwordVisibility"
              required
              label="New Password"
            />

            <InputPasswordConfirmation
              v-model="newPasswordConfirmation"
              v-model:visible="passwordVisibility"
              class="my-4"
              :password-to-match="newPassword"
            />

            <v-btn
              :loading="reqStatus === 'loading'"
              :disabled="v.$invalid"
              block
              color="green"
              @click="resetPassword"
            >
              Change Password
            </v-btn>

            <div class="text-center mt-4 text-body-2">
              Not what you are looking for ? <NuxtLink to="/">go back</NuxtLink>
            </div>
          </div>
        </template>

        <ResetPasswordSuccessMessage
          v-else-if="reqStatus === 'success'"
          class="my-10 mx-4"
        />

        <ResetPasswordErrorMessage
          v-else
          class="ma-6"
          :title="
            reqStatus === 'unauthorized'
              ? '401 - Unauthorized'
              : '500 - Oops, something went wrong'
          "
          :message="
            reqStatus === 'unauthorized'
              ? 'Seems like your password reset token expired, please send a new password reset email'
              : 'Internal server error, please try again with a new password reset email'
          "
        />
      </v-card>
    </v-row>
  </v-container>
</template>
