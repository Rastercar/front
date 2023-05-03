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
        <v-toolbar
          v-if="reqStatus === 'loading' || reqStatus === 'not-sent'"
          color="#355C7D"
          class="mb-4"
          flat
        >
          <v-card-title class="text-white w-100 text-center">
            Redefine password
          </v-card-title>
        </v-toolbar>

        <v-card-subtitle>
          Please inform and confirm your new password
        </v-card-subtitle>

        <div
          v-if="reqStatus === 'loading' || reqStatus === 'not-sent'"
          class="mx-4 mb-6 mt-4"
        >
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

          <!-- TODO: ADD BUTTON TO GO BACK TO ROOT / -->
        </div>

        <!-- TODO: FINISH ME! -->
        <!-- TODO: ADD ERROR AND SUCCESS MESSAGES -->
        <!-- <PasswordResetSuccess
          v-else-if="reqStatus === 'success'"
          class="q-ma-lg"
        />

        <PasswordResetError
          v-else
          class="q-ma-lg"
          :title="
            reqStatus === 'unauthorized'
              ? '401 - Não autorizado'
              : '500 - Oops algo deu errado'
          "
          :message="
            reqStatus === 'unauthorized'
              ? 'Parece que seu token expirou ou é invalido, por favor requisite um novo email de redefinição de senha'
              : 'Erro interno do sistema, por favor requisite um novo email de redefinição de senha'
          "
        /> -->
      </v-card>
    </v-row>
  </v-container>
</template>
