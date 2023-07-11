<script setup lang="ts">
import { HTTP_STATUS } from '~~/constants/http-status'
import { ApiLoginResponse } from '@/api/auth'

definePageMeta({ requiredLoginStatus: 'loggedOff' })

const formState = reactive({ password: '', email: '' })

const firedLoginRequest = ref(false)
const userEmailNotFound = ref(false)
const passwordIsInvalid = ref(false)
const pending = ref(false)

const authStore = useAuthStore()

const attemptLogin = async () => {
  const { data, refresh } = useApi<ApiLoginResponse>(`auth/login`, {
    method: 'POST',
    body: { ...formState },
    onResponseError: ({ response: { status } }) => {
      userEmailNotFound.value = status === HTTP_STATUS.NOT_FOUND
      passwordIsInvalid.value = status === HTTP_STATUS.UNAUTHORIZED
    },
  })

  firedLoginRequest.value = true
  pending.value = true

  await refresh().catch(() => {})

  const res = unref(data)
  if (res !== null) logIn(res)

  pending.value = false
}

const logIn = ({ user: u, token }: ApiLoginResponse) => {
  const { organization, ...user } = u

  authStore.logIn({ bearerToken: token.value, user, organization })
  navigateTo(user.masterAccessLevel ? '/master' : '/tracked')
}
</script>

<template>
  <v-container fluid fill-height class="m-0 p-0">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="12" md="6" class="tw-p-8">
        <img src="/img/login-background.svg" alt="login background" />
      </v-col>

      <v-col cols="12" sm="12" md="6" align="center">
        <v-card class="sm:tw-w-full md:tw-w-3/4 lg:tw-w-1/2">
          <v-toolbar color="#355C7D" class="mb-4" flat>
            <v-card-title class="text-white w-100 text-center">
              Welcome to Rastercar
            </v-card-title>
          </v-toolbar>

          <v-form>
            <div class="tw-p-4">
              <LoginEmailInput
                v-model="formState.email"
                :user-with-email-not-found="userEmailNotFound"
                class="ma-12"
                @update:modelValue="userEmailNotFound = false"
              />

              <LoginPasswordInput
                v-model="formState.password"
                :disabled="pending && firedLoginRequest"
                :is-invalid="passwordIsInvalid"
                @update:modelValue="passwordIsInvalid = false"
              />
            </div>

            <v-card-actions class="tw-px-4 flex-col">
              <v-btn
                @click="attemptLogin"
                class="text-white py-6 mb-3 text-h6"
                color="blue-darken-4"
                variant="flat"
                block
              >
                SIGN IN
              </v-btn>

              <LoginGoogleButton
                class="text-white py-6 ml-0 text-h6"
                color="grey-darken-1"
                variant="flat"
                block
              >
                SIGN IN WITH GOOGLE
              </LoginGoogleButton>

              <DevOnly>
                <v-btn
                  @click="
                    () => {
                      formState.email = 'rastercar.tests.001@gmail.com'
                      formState.password = 'masteruser1'
                      attemptLogin()
                    }
                  "
                  class="mt-3 py-6 text-white text-h6 ml-0"
                  color="green"
                  variant="flat"
                  block
                >
                  MASTER LOGIN
                </v-btn>

                <v-btn
                  @click="
                    () => {
                      formState.email = 'testuser@gmail.com'
                      formState.password = 'testuser'
                      attemptLogin()
                    }
                  "
                  class="mt-3 py-6 text-white text-h6 ml-0"
                  color="green"
                  variant="flat"
                  block
                >
                  TRACKED LOGIN
                </v-btn>
              </DevOnly>
            </v-card-actions>

            <LoginCardFooter class="mb-6 mt-4" />
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
